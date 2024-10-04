const { Chat, MessageChunk } = require('../models/chat.model');
const User = require('../models/auth.model');

const chatController = {
    // Create a new chat or group chat
    createChat: async (req, res) => {
        try {
            const { is_group_message, group_name, participants } = req.body;
            const sender = req.user.userId;

            const newChat = new Chat({
                sender,
                is_group_message,
                group_name: is_group_message ? group_name : null,
                participants: participants.map(userId => ({ user: userId }))
            });

            await newChat.save();
            res.status(201).json(newChat);
        } catch (error) {
            res.status(500).json({ message: 'Error creating chat', error })
        }
    },

    // Send a new message
    sendMessage: async (req, res) => {
        try {
            const { chatId } = req.params;
            const { message } = req.body;
            const sender = req.user.userId;

            let lastChunk = await MessageChunk.findOne({ chat: chatId }).sort({ created_at: -1 });
            const MAX_MESSAGES_PER_CHUNK = 100;
            if (!lastChunk || lastChunk.messages.length >= MAX_MESSAGES_PER_CHUNK) {
                lastChunk = new MessageChunk({ chat: chatId, messages: [] });
            }

            lastChunk.messages.push({ message, sender });
            await lastChunk.save();

            res.status(200).json({ message: 'Message sent successfully', chunk: lastChunk });
        } catch (error) {
            res.status(500).json({ message: 'Error sending message', error });
        }
    },

    // Retrieve messages (paginated)
    getMessages: async (req, res) => {
        try {
            const { chatId, page = 1, limit = 30 } = req.params;
            const messageChunks = await MessageChunk.find({ chat: chatId })
                .sort({ created_at: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            res.status(200).json({ messages: messageChunks });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving messages', error });
        }
    },

    // Mark messages as read
    markMessagesAsRead: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user.userId;

            await MessageChunk.updateMany(
                { chat: chatId, 'messages.meta.user': userId },
                { $set: { 'messages.$.meta.$[elem].read': true } },
                { arrayFilters: [{ 'elem.user': userId }] }
            );

            res.status(200).json({ message: 'Messages marked as read' });
        } catch (error) {
            res.status(500).json({ message: 'Error marking messages as read', error });
        }
    },

    // Delete a specific message
    deleteMessage: async (req, res) => {
        try {
            const { chatId, messageId } = req.params;
            await MessageChunk.updateOne(
                { chat: chatId },
                { $pull: { messages: { _id: messageId } } }
            );

            res.status(200).json({ message: 'Message deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting message', error });
        }
    },

    // Archive the chat for a user
    archiveChat: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user.userId;
            await Chat.findByIdAndUpdate(chatId, { $addToSet: { archived: userId } });
            res.status(200).json({ message: 'Chat archived' });
        } catch (error) {
            res.status(500).json({ message: 'Error archiving chat', error });
        }
    },

    // Unarchive the chat for a user
    unarchiveChat: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user.userId;
            await Chat.findByIdAndUpdate(chatId, { $pull: { archived: userId } });
            res.status(200).json({ message: 'Chat unarchived' });
        } catch (error) {
            res.status(500).json({ message: 'Error unarchiving chat', error });
        }
    },

    // Mute the chat for a user
    muteChat: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user.userId;
            await Chat.findByIdAndUpdate(chatId, { $addToSet: { muted: userId } });
            res.status(200).json({ message: 'Chat muted' });
        } catch (error) {
            res.status(500).json({ message: 'Error muting chat', error });
        }
    },

    // Unmute the chat for a user
    unmuteChat: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user.userId;
            await Chat.findByIdAndUpdate(chatId, { $pull: { muted: userId } });
            res.status(200).json({ message: 'Chat unmuted' });
        } catch (error) {
            res.status(500).json({ message: 'Error unmuting chat', error });
        }
    },

    // Leave a chat
    leaveChat: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user._id;
            await Chat.findByIdAndUpdate(chatId, { $pull: { participants: { user: userId } } });
            res.status(200).json({ message: 'Left chat' });
        } catch (error) {
            res.status(500).json({ message: 'Error leaving chat', error });
        }
    },

    // Delete a chat
    deleteChat: async (req, res) => {
        try {
            const { chatId } = req.params;
            await Chat.findByIdAndDelete(chatId);
            await MessageChunk.deleteMany({ chat: chatId });
            res.status(200).json({ message: 'Chat deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting chat', error });
        }
    },

    // Get all chats for a user (paginated)
    getUserChats: async (req, res) => {
        try {
            const { userId } = req.user;
            const { page = 1, limit = 30 } = req.query;
            const chats = await Chat.find({ participants: { $elemMatch: { user: userId } } })
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            res.status(200).json({ chats });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user chats', error });
        }
    }
};

module.exports = chatController;
