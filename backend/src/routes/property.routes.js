// src/routes/property.routes.js

import { Router } from "express";
import {
  getAllActiveProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

import { ensureAuth } from "../middleware/authMiddleware.js";

const router = Router();

/* ===========================
   🟢 PUBLIC
=========================== */
router.get("/", getAllActiveProperties);
router.get("/:slug", getPropertyBySlug);

/* ===========================
   🔒 HOST
=========================== */
router.post("/", ensureAuth, createProperty);
router.put("/:id", ensureAuth, updateProperty);
router.delete("/:id", ensureAuth, deleteProperty);

export default router;
