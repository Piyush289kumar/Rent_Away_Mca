// src/models/property/propertyReview.model.js

import mongoose from "mongoose";

const propertyReviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      maxlength: 500,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

propertyReviewSchema.index({ property: 1, user: 1 }, { unique: true });

export default mongoose.model("PropertyReview", propertyReviewSchema);
