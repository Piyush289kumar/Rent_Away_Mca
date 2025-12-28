// src/models/property/property.model.js

import mongoose from "mongoose";
import slugify from "slugify";

/* ===========================
   SEO Schema (reused pattern)
=========================== */
const seoSchema = new mongoose.Schema(
  {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
  { _id: false }
);

/* ===========================
   Address + Geo Location
=========================== */
const locationSchema = new mongoose.Schema(
  {
    addressLine1: String,
    addressLine2: String,
    city: { type: String, index: true },
    state: String,
    country: { type: String, index: true },
    zipCode: String,

    // GeoJSON for map & distance search
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        index: "2dsphere",
      },
    },
  },
  { _id: false }
);

/* ===========================
   Property Schema
=========================== */
const propertySchema = new mongoose.Schema(
  {
    /* 🔐 Ownership */
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* 📌 Basic Info */
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    /* 🏘 Property Type */
    propertyType: {
      type: String,
      enum: [
        "apartment",
        "house",
        "villa",
        "studio",
        "hotel",
        "resort",
        "hostel",
      ],
      index: true,
    },

    /* 👥 Capacity */
    guests: { type: Number, default: 1 },
    bedrooms: { type: Number, default: 0 },
    beds: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },

    /* 💰 Pricing */
    pricing: {
      perNight: { type: Number, required: true },
      perWeek: Number,
      perMonth: Number,
      cleaningFee: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },

    /* 🏷 Amenities */
    amenities: [
      {
        type: String,
        index: true,
      },
    ],

    /* 📸 Media */
    coverImage: String,
    gallery: [String],

    /* 📍 Location */
    location: locationSchema,

    /* 📝 Rules */
    houseRules: {
      smoking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      parties: { type: Boolean, default: false },
      checkInTime: String,
      checkOutTime: String,
    },

    /* ⭐ Ratings */
    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    /* 📈 Status */
    isActive: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },

    /* 🔍 SEO */
    seo: seoSchema,

    /* 👤 Audit */
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

/* ===========================
   Slug Auto Generate
=========================== */
propertySchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

/* ===========================
   Text Search Index
=========================== */
propertySchema.index({
  title: "text",
  description: "text",
  amenities: "text",
  "location.city": "text",
  "location.country": "text",
});

export default mongoose.model("Property", propertySchema);