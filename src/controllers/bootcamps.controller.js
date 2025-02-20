const BootCampModel = require("../models/bootcamp.model");
const logger = require("../utils/logger");
const generateRandomString = require("../utils/randomString");

const createBootcampRegistration = async (req, res) => {
  try {
    const { name, start, end } = req.body;
    const student = req.user.userId; // From verifyToken middleware
    const transactionId = generateRandomString(15);

    const newRegistration = new BootCampModel({
      name,
      start,
      end,
      student,
      transactionId,
      paymentStatus: "unpaid",
    });

    const savedRegistration = await newRegistration.save();
    logger.infoLogger("Bootcamp Registration Created", savedRegistration);

    res.status(201).json({
      message: "Bootcamp registration successful",
      registration: savedRegistration,
    });
  } catch (error) {
    logger.errorLogger("Error creating bootcamp registration", error);
    res.status(500).json({ message: "Error registering for bootcamp", error });
  }
};

const updateBootcampRegistration = async (req, res) => {
  try {
    const { paymentId, paymentStatus } = req.body;
    const registrationId = req.params.id;

    let updateData = {};
    if (paymentId) updateData.paymentId = paymentId;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedRegistration = await BootCampModel.findByIdAndUpdate(
      registrationId,
      updateData,
      { new: true },
    );

    if (!updatedRegistration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    logger.infoLogger("Bootcamp Registration Updated", updatedRegistration);
    res
      .status(200)
      .json({ message: "Registration updated", updatedRegistration });
  } catch (error) {
    logger.errorLogger("Error updating bootcamp registration", error);
    res.status(500).json({ message: "Error updating registration", error });
  }
};

const getBootcampRegistrationById = async (req, res) => {
  try {
    const registration = await BootCampModel.findById(req.params.id).populate(
      "student",
    );

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json({ registration });
  } catch (error) {
    logger.errorLogger("Error fetching bootcamp registration", error);
    res.status(500).json({ message: "Error fetching registration", error });
  }
};

const getBootcampRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 30, name, student, paymentStatus } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (name) query.name = new RegExp(name, "i");
    if (student) query.student = student;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const registrations = await BootCampModel.find(query)
      .populate("student")
      .skip(skip)
      .limit(Number(limit));

    const totalRegistrations = await BootCampModel.countDocuments(query);

    res.status(200).json({
      registrations,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRegistrations / limit),
    });
  } catch (error) {
    logger.errorLogger("Error fetching bootcamp registrations", error);
    res.status(500).json({ message: "Error fetching registrations", error });
  }
};

const deleteBootcampRegistration = async (req, res) => {
  try {
    const deletedRegistration = await BootCampModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedRegistration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    logger.infoLogger("Bootcamp Registration Deleted", deletedRegistration);
    res.status(200).json({ message: "Registration deleted successfully" });
  } catch (error) {
    logger.errorLogger("Error deleting bootcamp registration", error);
    res.status(500).json({ message: "Error deleting registration", error });
  }
};

module.exports = {
  createBootcampRegistration,
  updateBootcampRegistration,
  getBootcampRegistrationById,
  getBootcampRegistrations,
  deleteBootcampRegistration,
};
