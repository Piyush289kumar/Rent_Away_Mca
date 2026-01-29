// src/controllers/property.controller.js

import Property from "../models/property/property.model.js";
import PropertyAvailability from "../models/property/propertyAvailability.model.js";
import mongoose from "mongoose";
import slugify from "slugify";
import { uploadToCloudinary } from "../utils/cloudinaryService.js";

/* ===========================
   🟢 PUBLIC – SEARCH & LIST
=========================== */
export const getAllActiveProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      guests,
      minPrice,
      maxPrice,
      propertyType,
      search,
    } = req.query;

    const match = { isActive: true, isPublished: true };

    if (city) match["location.city"] = { $regex: city, $options: "i" };
    if (propertyType) match.propertyType = propertyType;
    if (guests) match.guests = { $gte: Number(guests) };

    if (minPrice || maxPrice) {
      match["pricing.perNight"] = {};
      if (minPrice) match["pricing.perNight"].$gte = Number(minPrice);
      if (maxPrice) match["pricing.perNight"].$lte = Number(maxPrice);
    }

    if (search) {
      match.$text = { $search: search };
    }

    const total = await Property.countDocuments(match);

    const properties = await Property.find(match)
      .populate("host", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   🟢 GET SINGLE PROPERTY
=========================== */
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("host", "name email")
      .lean();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   🔒 HOST – CREATE PROPERTY
=========================== */

export const createProperty = async (req, res) => {
  try {
    /* ---------------------------------
       BASIC VALIDATION
    --------------------------------- */
    const title = req.body?.title?.trim();

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (title.length < 10) {
      return res.status(422).json({
        success: false,
        message: "Title must be at least 10 characters long",
      });
    }

    const slug = slugify(title, { lower: true, strict: true });

    if (await Property.findOne({ slug })) {
      return res.status(409).json({
        success: false,
        message: "Property title already exists",
      });
    }

    /* ---------------------------------
       SAFE NUMBER PARSING - Handle both flat & nested
    --------------------------------- */
    let perNightRaw;

    // ✅ Try nested object first (Multer's actual behavior)
    if (
      req.body.pricing &&
      typeof req.body.pricing === "object" &&
      req.body.pricing.perNight !== undefined
    ) {
      perNightRaw = req.body.pricing.perNight;
    }
    // Fallback to flat bracket notation
    else if (req.body["pricing[perNight]"]) {
      perNightRaw = req.body["pricing[perNight]"];
    }
    // Final fallback - check if pricing is stringified JSON
    else if (req.body.pricing && typeof req.body.pricing === "string") {
      try {
        const parsedPricing = JSON.parse(req.body.pricing);
        perNightRaw = parsedPricing.perNight;
      } catch {}
    }

    if (
      !perNightRaw ||
      isNaN(Number(perNightRaw)) ||
      Number(perNightRaw) <= 0
    ) {
      return res.status(422).json({
        success: false,
        message:
          "Price per night is required and must be a valid number greater than 0",
      });
    }

    /* ---------------------------------
       PRICING - Handle both flat & nested consistently
    --------------------------------- */
    const getPricingValue = (key) => {
      // Nested object
      if (
        req.body.pricing &&
        typeof req.body.pricing === "object" &&
        req.body.pricing[key] !== undefined
      ) {
        return req.body.pricing[key];
      }
      // Flat bracket notation
      return req.body[`pricing[${key}]`];
    };

    const pricing = {
      perNight: Number(perNightRaw),
      cleaningFee: getPricingValue("cleaningFee")
        ? Number(getPricingValue("cleaningFee"))
        : 0,
      serviceFee: getPricingValue("serviceFee")
        ? Number(getPricingValue("serviceFee"))
        : 0,
    };

    /* ---------------------------------
       FILE UPLOADS
    --------------------------------- */
    let coverImageUrl = null;
    const galleryImages = [];

    // Cover Image
    if (req.files?.coverImage?.[0]?.path) {
      const upload = await uploadToCloudinary(
        req.files.coverImage[0].path,
        "property/cover",
      );
      coverImageUrl = upload.secure_url;
    }

    // Gallery
    if (Array.isArray(req.files?.gallery)) {
      for (const file of req.files.gallery) {
        const upload = await uploadToCloudinary(file.path, "property/gallery");
        galleryImages.push(upload.secure_url);
      }
    }

    /* ---------------------------------
       AMENITIES (SAFE ARRAY) - Handle both formats
    --------------------------------- */
    let amenities = [];
    const amenitiesRaw = req.body["amenities[]"] || req.body.amenities;

    if (amenitiesRaw) {
      amenities = Array.isArray(amenitiesRaw)
        ? amenitiesRaw
        : typeof amenitiesRaw === "string"
          ? amenitiesRaw
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [amenitiesRaw];
    }

    /* ---------------------------------
       SEO (SAFE PARSE) - Handle both formats
    --------------------------------- */
    let seo = {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
    };

    const getSeoValue = (key) => {
      // Nested object
      if (
        req.body.seo &&
        typeof req.body.seo === "object" &&
        req.body.seo[key] !== undefined
      ) {
        return req.body.seo[key];
      }
      // Flat bracket notation
      return req.body[`seo[${key}]`];
    };

    try {
      seo.metaTitle = getSeoValue("metaTitle") || "";
      seo.metaDescription = getSeoValue("metaDescription") || "";

      const metaKeywordsRaw = getSeoValue("metaKeywords");
      if (metaKeywordsRaw) {
        seo.metaKeywords = Array.isArray(metaKeywordsRaw)
          ? metaKeywordsRaw
          : typeof metaKeywordsRaw === "string"
            ? JSON.parse(metaKeywordsRaw)
            : [];
      }
    } catch {
      // Keep defaults if parsing fails
    }

    /* ---------------------------------
       CREATE PROPERTY
    --------------------------------- */
    const property = await Property.create({
      title,
      slug,
      description: req.body.description || "",
      propertyType: req.body.propertyType || "apartment",

      guests: Number(req.body.guests) || 1,
      bedrooms: Number(req.body.bedrooms) || 1,
      beds: Number(req.body.beds) || 1,
      bathrooms: Number(req.body.bathrooms) || 1,

      pricing,
      amenities,

      coverImage: coverImageUrl,
      gallery: galleryImages,

      seo,

      isActive: req.body.isActive === "true",
      isPublished: req.body.isPublished === "true",
      isFeatured: req.body.isFeatured === "true",

      host: req.user._id,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (err) {
    console.error("CREATE PROPERTY ERROR:", err);

    /* ------------------ MONGOOSE VALIDATION ------------------ */
    if (err.name === "ValidationError") {
      const errors = {};
      for (const key in err.errors) {
        errors[key] = err.errors[key].message;
      }

      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ===========================
   🔒 HOST – UPDATE PROPERTY
=========================== */
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property)
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });

    if (property.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    Object.assign(property, req.body);

    if (req.body.title) {
      property.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
    }

    property.updatedBy = req.user._id;
    await property.save();

    res.json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   🔴 DELETE PROPERTY
=========================== */
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property)
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });

    if (property.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   🔒 ADMIN – GET ALL PROPERTIES
=========================== */
export const getAllPropertiesAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      filter = "all",
    } = req.query;

    const query = {};

    if (filter === "active") query.isActive = true;
    if (filter === "inactive") query.isActive = false;
    if (filter === "featured") query.isFeatured = true;
    if (filter === "published") query.isPublished = true;
    if (filter === "draft") query.isPublished = false;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.country": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .populate("host", "name email")
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   🔒 ADMIN – PATCH PROPERTY
=========================== */
export const partiallyUpdatePropertyAdmin = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "pricing",
      "isActive",
      "isPublished",
      "isFeatured",
      "propertyType",
      "amenities",
      "seo",
    ];

    Object.entries(req.body).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        property[key] = value;
      }
    });

    if (req.body.title) {
      property.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    property.updatedBy = req.user._id;
    await property.save();

    res.json({
      success: true,
      data: property,
      message: "Property updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ===========================
   🔒 ADMIN – DELETE PROPERTY
=========================== */
export const deletePropertyAdmin = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
