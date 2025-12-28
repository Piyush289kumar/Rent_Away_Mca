// src/models/booking/booking.model.js

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    /* 🏠 Property */
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    /* 👤 Guest */
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* 👤 Host */
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* 📅 Dates */
    checkIn: {
      type: Date,
      required: true,
      index: true,
    },

    checkOut: {
      type: Date,
      required: true,
      index: true,
    },

    nights: {
      type: Number,
      required: true,
    },

    /* 👥 Guests */
    totalGuests: {
      type: Number,
      required: true,
    },

    /* 💰 Pricing Snapshot */
    pricing: {
      perNight: Number,
      cleaningFee: Number,
      serviceFee: Number,
      subtotal: Number,
      total: Number,
      currency: { type: String, default: "INR" },
    },

    /* 📌 Booking Status */
    status: {
      type: String,
      enum: [
        "pending", // waiting for host approval
        "confirmed", // booked
        "cancelled",
        "completed",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    /* 📝 Optional */
    note: String,

    /* 🔁 Extension Support */
    isExtended: {
      type: Boolean,
      default: false,
    },

    parentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  },
  { timestamps: true, versionKey: false }
);

/* ===========================
   Prevent Date Conflicts
=========================== */
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);
