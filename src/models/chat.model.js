const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Message schema (unchanged)
const MessageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// New schema for handling message chunks
const MessageChunkSchema = new Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  messages: [MessageSchema], // Array of messages in this chunk
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_group_message: {
      type: Boolean,
      default: false,
    },
    group_name: {
      type: String,
      required: function () {
        return this.is_group_message;
      },
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        delivered: Boolean,
        read: Boolean,
        last_seen: Date,
      },
    ],
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", ChatSchema);
const MessageChunk = mongoose.model("MessageChunk", MessageChunkSchema);

module.exports = { Chat, MessageChunk };
