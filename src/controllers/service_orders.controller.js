const ServiceOrderModel = require("../models/service_orders.model");
const servicePrices = require("../utils/pricing");
const logger = require("../utils/logger");
const generateRandomString = require("../utils/randomString");

const createServiceOrders = async (request, response) => {
  let { name, packageType, client, userEmail } = request.body;
  let transactionId = generateRandomString(15);
  let paymentStatus = "unpaid";
  let amount = servicePrices[name][packageType];
  let initialData = {
    name,
    packageType,
    client,
    userEmail,
    paymentStatus,
    transactionId,
    amount,
  };
  console.log({ initialData });
  let newOrder = new ServiceOrderModel(initialData);
  try {
    let saved = newOrder.save();
    logger.infoLogger(`Service Order Created`);
    logger.infoLogger(saved);
    response.status(201).json({
      message: "Service Order Processed Successfully",
      serviceOrder: saved,
    });
  } catch (err) {
    logger.error("Unable to Create Service Order.");
    logger.error(err);
    response
      .status(500)
      .json({ error: err, message: "Unable to Create new Service Order" });
  }
};

const updateServiceOrders = async (request, response) => {
  try {
    const {
      paymentMethod,
      preferredCommunicationChannel,
      projectName,
      pdescription,
      specialNotes,
      estimatedDeliveryDate,
      duration,
      style,
      referenceLinks,
      setUpStop,
    } = request.body;

    const orderId = request.params.orderId; // Assuming order ID is passed in params

    let saveObject = { projectDetails: {} };

    if (paymentMethod) saveObject.paymentMethod = paymentMethod;
    if (preferredCommunicationChannel)
      saveObject.preferredCommunicationChannel = preferredCommunicationChannel;

    if (projectName) saveObject.projectDetails.projectName = projectName;
    if (pdescription) saveObject.projectDetails.description = pdescription;
    if (specialNotes) saveObject.projectDetails.specialNotes = specialNotes;
    if (estimatedDeliveryDate)
      saveObject.projectDetails.estimatedDeliveryDate = estimatedDeliveryDate;
    if (duration) saveObject.projectDetails.duration = duration;
    if (style) saveObject.projectDetails.style = style;
    if (referenceLinks)
      saveObject.projectDetails.referenceLinks = referenceLinks;

    if (setUpStop) saveObject.setUpStop = setUpStop;

    // Log data for debugging
    logger.infoLogger(`Updating Service Order: ${orderId}`, true);
    logger.infoLogger(saveObject, true);

    const updated = await ServiceOrderModel.updateOne(
      { _id: orderId },
      { $set: saveObject },
    );

    if (updated.modifiedCount === 0) {
      return response
        .status(404)
        .json({ message: "Order not found or no changes made." });
    }

    response
      .status(200)
      .json({ message: "Service Order updated successfully", updated });
  } catch (err) {
    logger.errorLogger("Error updating service order", true);
    logger.errorLogger(err, true);
    response
      .status(500)
      .json({ error: err, message: "Error updating service order" });
  }
};

const getServiceOrdersByID = async (request, response) => {
  try {
    const { id } = request.params;
    if (!id)
      return response.status(400).json({ message: "Order ID is required" });

    const doc = await ServiceOrderModel.findById(id);
    if (!doc)
      return response.status(404).json({ message: "Service order not found" });

    response.status(200).json(doc);
  } catch (err) {
    logger.errorLogger("Error fetching service order by ID:", err);
    response.status(500).json({ error: "Error fetching service order" });
  }
};

const getServiceOrders = async (request, response) => {
  try {
    let {
      page = 1,
      limit = 30,
      sortBy = "createdAt",
      sortOrder = "desc",
      ...filters
    } = request.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const skip = (page - 1) * limit;

    // Constructing query object
    let query = {};
    if (filters.paymentMethod)
      query.paymentMethod = new RegExp(filters.paymentMethod, "i");
    if (filters.projectName)
      query["projectDetails.projectName"] = new RegExp(
        filters.projectName,
        "i",
      );
    if (filters.status) query.status = filters.status; // Assuming exact match for status
    if (filters.client) query.client = new RegExp(filters.client, "i");

    logger.infoLogger("Fetching service orders with query:", query);

    const docs = await ServiceOrderModel.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await ServiceOrderModel.countDocuments(query);

    response.status(200).json({
      serviceOrders: docs,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
  } catch (err) {
    logger.errorLogger("Error fetching service orders:", err);
    response.status(500).json({ error: "Error fetching service orders" });
  }
};

const deleteServiceOrders = async (request, response) => {
  try {
    const { id } = request.params;
    if (!id)
      return response.status(400).json({ message: "Order ID is required" });

    const deletedOrder = await ServiceOrderModel.findByIdAndDelete(id);
    if (!deletedOrder)
      return response.status(404).json({ message: "Service order not found" });

    response
      .status(200)
      .json({ message: "Service order deleted successfully" });
  } catch (err) {
    logger.errorLogger("Error deleting service order:", err);
    response.status(500).json({ error: "Error deleting service order" });
  }
};

module.exports = {
  createServiceOrders,
  updateServiceOrders,
  getServiceOrdersByID,
  getServiceOrders,
  deleteServiceOrders,
};
