// src/controllers/booking.controller.js

import Booking from "../models/booking/booking.model.js";
import Property from "../models/property/property.model.js";

/* ===========================
   🔍 AVAILABILITY CHECK
=========================== */
const isDateAvailable = async (propertyId, checkIn, checkOut) => {
  const conflict = await Booking.findOne({
    property: propertyId,
    status: { $in: ["pending", "confirmed"] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });

  return !conflict;
};

/* ===========================
   🟢 CUSTOMER — CREATE BOOKING
=========================== */
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, totalGuests, note } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || !property.isActive || !property.isPublished) {
      return res.status(404).json({ message: "Property not available" });
    }

    if (totalGuests > property.guests) {
      return res.status(400).json({ message: "Guest capacity exceeded" });
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const available = await isDateAvailable(propertyId, inDate, outDate);
    if (!available) {
      return res.status(409).json({ message: "Dates already booked" });
    }

    const nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));

    const subtotal = nights * property.pricing.perNight;
    const total =
      subtotal +
      (property.pricing.cleaningFee || 0) +
      (property.pricing.serviceFee || 0);

    const booking = await Booking.create({
      property: propertyId,
      guest: req.user._id,
      host: property.host,
      checkIn: inDate,
      checkOut: outDate,
      nights,
      totalGuests,
      pricing: {
        perNight: property.pricing.perNight,
        cleaningFee: property.pricing.cleaningFee,
        serviceFee: property.pricing.serviceFee,
        subtotal,
        total,
      },
      note,
      status: "pending",
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ===========================
   🟢 CUSTOMER — MY BOOKINGS
=========================== */
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate("property", "title coverImage location.city")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: bookings });
};

/* ===========================
   🔒 HOST — BOOKINGS
=========================== */
export const getHostBookings = async (req, res) => {
  const bookings = await Booking.find({ host: req.user._id })
    .populate("property", "title")
    .populate("guest", "name email")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: bookings });
};

/* ===========================
   🔒 HOST — APPROVE / REJECT
=========================== */
export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  if (!["confirmed", "rejected", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (booking.host.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  booking.status = status;
  await booking.save();

  res.json({ success: true, data: booking });
};

/* ===========================
   ❌ CANCEL (GUEST / HOST)
=========================== */
export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const uid = req.user._id.toString();
  if (booking.guest.toString() !== uid && booking.host.toString() !== uid) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  booking.status = "cancelled";
  await booking.save();

  res.json({ success: true, message: "Booking cancelled successfully" });
};

/* ===========================
   🔒 ADMIN — ALL BOOKINGS
=========================== */
/* ===========================
   🔒 ADMIN — ALL BOOKINGS (WITH PAGINATION)
=========================== */
export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.query;

    const query = {};

    /* Filter by status */
    if (status && status !== "all") {
      query.status = status;
    }

    /* Search by note (optional) */
    if (search) {
      query.note = { $regex: search, $options: "i" };
    }

    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate("property", "title coverImage")
      .populate("guest host", "name email")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ===========================
   🔒 ADMIN — BOOKING BY ID
=========================== */
export const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("property")
    .populate("guest host", "name email")
    .lean();

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  res.json({ success: true, data: booking });
};

/* ===========================
   🔒 ADMIN — DELETE
=========================== */
export const deleteBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  await booking.deleteOne();
  res.json({ success: true, message: "Booking deleted" });
};
