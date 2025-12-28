// src/models/property/propertyAvailability.model.js

import mongoose from "mongoose";

const propertyAvailabilitySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    priceOverride: {
      type: Number,
      default: null,
    },

    reason: {
      type: String, // maintenance | personal | booked
    },
  },
  { timestamps: true, versionKey: false }
);

propertyAvailabilitySchema.index({ property: 1, date: 1 }, { unique: true });

export default mongoose.model(
  "PropertyAvailability",
  propertyAvailabilitySchema
);
