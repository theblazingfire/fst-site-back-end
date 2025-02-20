const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectDetailsSchema = new Schema({
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  specialNotes: { type: String },
  referenceFiles: [{ type: String }],
  estimatedDeliveryDate: { type: Date },
  duration: { type: String },
  style: [{ type: String }],
  referenceLinks: [{ type: String }],
});

const FileUploadsSchema = new Schema({
  logo: { type: String },
  brandAssets: [{ type: String }],
  contentDocuments: [{ type: String }],
});

const ServiceOrdersSchema = new Schema(
  {
    name: {
      type: String,
      enum: [
        "branding",
        "creativeGraphicsDesign",
        "uiUxDesign",
        "webDevelopment",
      ],
      required: true,
    },
    packageType: {
      type: String,
      enum: ["regular", "standard", "premium"],
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Invalid email format",
      },
    },
    amount: {
      type: Number,
      default: 0,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["bankTransfer", "card", "paypal"],
    },
    preferredCommunicationChannel: {
      type: String,
      enum: ["whatsapp", "email", "instagram"],
    },
    projectDetails: ProjectDetailsSchema,
    fileUploads: FileUploadsSchema,
    setUpStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "inProgress", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const ServiceOrdersModel = mongoose.model("ServiceOrders", ServiceOrdersSchema);

module.exports = ServiceOrdersModel;
