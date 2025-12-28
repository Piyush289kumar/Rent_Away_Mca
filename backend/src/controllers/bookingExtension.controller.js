// src/controllers/bookingExtension.controller.js

import Booking from "../models/booking/booking.model.js";
import Property from "../models/property/property.model.js";

/* ===========================
   🔍 CHECK DATE CONFLICT
=========================== */
const hasDateConflict = async (
  propertyId,
  fromDate,
  toDate,
  ignoreBookingId = null
) => {
  const query = {
    property: propertyId,
    status: { $in: ["pending", "confirmed"] },
    checkIn: { $lt: toDate },
    checkOut: { $gt: fromDate },
  };

  if (ignoreBookingId) {
    query._id = { $ne: ignoreBookingId };
  }

  const conflict = await Booking.findOne(query);
  return !!conflict;
};

/* ===========================
   🟢 REQUEST EXTENSION (GUEST)
=========================== */
export const requestBookingExtension = async (req, res) => {
  try {
    const { newCheckOut } = req.body;

    const booking = await Booking.findById(req.params.id).populate("property");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed bookings can be extended",
      });
    }

    const oldCheckOut = booking.checkOut;
    const newOutDate = new Date(newCheckOut);

    if (newOutDate <= oldCheckOut) {
      return res.status(400).json({
        success: false,
        message: "New checkout must be after current checkout",
      });
    }

    /* 🔒 Check conflict */
    const conflict = await hasDateConflict(
      booking.property._id,
      oldCheckOut,
      newOutDate,
      booking._id
    );

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "Extension dates not available",
      });
    }

    /* 📆 Calculate nights */
    const extraNights = (newOutDate - oldCheckOut) / (1000 * 60 * 60 * 24);

    const perNight = booking.pricing.perNight;
    const subtotal = extraNights * perNight;
    const total = subtotal; // fees optional on extension

    /* 🧾 Create Extension Booking */
    const extensionBooking = await Booking.create({
      property: booking.property._id,
      guest: booking.guest,
      host: booking.host,
      checkIn: oldCheckOut,
      checkOut: newOutDate,
      nights: extraNights,
      totalGuests: booking.totalGuests,
      pricing: {
        perNight,
        subtotal,
        total,
        currency: booking.pricing.currency,
      },
      status: "pending",
      parentBooking: booking._id,
    });

    res.status(201).json({
      success: true,
      message: "Extension request sent to host",
      data: extensionBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   🔒 HOST – APPROVE EXTENSION
=========================== */
export const approveExtension = async (req, res) => {
  try {
    const extension = await Booking.findById(req.params.id);

    if (!extension) {
      return res.status(404).json({
        success: false,
        message: "Extension booking not found",
      });
    }

    if (extension.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* 🔒 Recheck conflict */
    const conflict = await hasDateConflict(
      extension.property,
      extension.checkIn,
      extension.checkOut,
      extension._id
    );

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "Dates conflict detected",
      });
    }

    extension.status = "confirmed";
    await extension.save();

    /* 🔗 Update Parent Booking */
    await Booking.findByIdAndUpdate(extension.parentBooking, {
      isExtended: true,
    });

    res.json({
      success: true,
      message: "Booking extension approved",
      data: extension,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   ❌ HOST – REJECT EXTENSION
=========================== */
export const rejectExtension = async (req, res) => {
  try {
    const extension = await Booking.findById(req.params.id);

    if (!extension) {
      return res.status(404).json({
        success: false,
        message: "Extension booking not found",
      });
    }

    if (extension.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    extension.status = "rejected";
    await extension.save();

    res.json({
      success: true,
      message: "Booking extension rejected",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
