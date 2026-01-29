// src/routes/property.routes.js

import { Router } from "express";
import {
  getAllActiveProperties,
  getPropertyById,
  // ADMIN
  createProperty,
  updateProperty,
  deleteProperty,
  getAllPropertiesAdmin,
  partiallyUpdatePropertyAdmin,
  deletePropertyAdmin,
} from "../controllers/property.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";
const router = Router();

/* ===========================
   🟢 PUBLIC
=========================== */
router.get("/", getAllActiveProperties);
router.get("/:id", getPropertyById);

/* ===========================
   🔒 HOST
=========================== */

/* ===========================
   🔒 HOST
=========================== */
router.post(
  "/admin",
  ensureAuth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  createProperty,
);

router.put(
  "/admin/:id",
  ensureAuth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  updateProperty,
);

router.delete("/admin/:id", ensureAuth, deleteProperty);

/* ===========================
   🔒 ADMIN
=========================== */
router.get("/admin/all", ensureAuth, getAllPropertiesAdmin);
router.patch("/admin/:id", ensureAuth, partiallyUpdatePropertyAdmin);
router.delete("/admin/:id", ensureAuth, deletePropertyAdmin);

export default router;
