// src/models/actions/galleryDownload.model.js

import mongoose from "mongoose";

const galleryDownloadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    gallery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gallery",
      required: true,
    },
    format: String,
    quality: String,
  },
  { timestamps: true }
);

export default mongoose.model("GalleryDownload", galleryDownloadSchema);
