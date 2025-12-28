// src/models/actions/galleryLike.model.js

import mongoose from "mongoose";

const galleryLikeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gallery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gallery",
      required: true,
    },
  },
  { timestamps: true }
);

galleryLikeSchema.index({ user: 1, gallery: 1 }, { unique: true });

export default mongoose.model("GalleryLike", galleryLikeSchema);
