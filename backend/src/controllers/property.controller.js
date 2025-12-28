// src/controllers/property.controller.js

import Property from "../models/property/property.model.js";
import PropertyAvailability from "../models/property/propertyAvailability.model.js";
import mongoose from "mongoose";
import slugify from "slugify";

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
export const getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({
      slug: req.params.slug,
      isActive: true,
    })
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
    const slug = slugify(req.body.title, { lower: true, strict: true });

    if (await Property.findOne({ slug })) {
      return res
        .status(400)
        .json({ success: false, message: "Property already exists" });
    }

    const property = await Property.create({
      ...req.body,
      slug,
      host: req.user._id,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
