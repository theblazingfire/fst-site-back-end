// notification.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Assuming notifications are user-specific
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // You can add more fields like notification type, links, etc. as needed
});

notificationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
