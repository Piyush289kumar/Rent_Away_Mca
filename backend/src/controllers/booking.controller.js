// src/controllers/booking.controller.js

import Booking from "../models/booking/booking.model.js";
import Property from "../models/property/property.model.js";

/* ===========================
   🔍 CHECK AVAILABILITY
=========================== */
const isDateAvailable = async (propertyId, checkIn, checkOut) => {
  const conflict = await Booking.findOne({
    property: propertyId,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
      },
    ],
  });

  return !conflict;
};

/* ===========================
   🟢 CREATE BOOKING
=========================== */
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, totalGuests, note } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || !property.isActive || !property.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Property not available",
      });
    }

    if (totalGuests > property.guests) {
      return res.status(400).json({
        success: false,
        message: "Guest capacity exceeded",
      });
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    /* 🔒 Conflict Check */
    const available = await isDateAvailable(property._id, inDate, outDate);

    if (!available) {
      return res.status(409).json({
        success: false,
        message: "Dates are already booked",
      });
    }

    const nights = (outDate - inDate) / (1000 * 60 * 60 * 24);

    /* 💰 Pricing Snapshot */
    const subtotal = nights * property.pricing.perNight;
    const total =
      subtotal +
      (property.pricing.cleaningFee || 0) +
      (property.pricing.serviceFee || 0);

    const booking = await Booking.create({
      property: property._id,
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
      status: "pending", // change to confirmed for instant booking
      note,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   🔒 HOST – APPROVE / REJECT
=========================== */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });

    if (booking.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   ❌ CANCEL BOOKING
=========================== */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (
      booking.guest.toString() !== req.user._id.toString() &&
      booking.host.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
