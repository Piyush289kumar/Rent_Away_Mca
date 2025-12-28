// src/routes/bookingExtension.routes.js

import { Router } from "express";
import {
  requestBookingExtension,
  approveExtension,
  rejectExtension,
} from "../controllers/bookingExtension.controller.js";

import { ensureAuth } from "../middleware/authMiddleware.js";

const router = Router();

/* ===========================
   🟢 GUEST
=========================== */
router.post("/:id/extend", ensureAuth, requestBookingExtension);

/* ===========================
   🔒 HOST
=========================== */
router.patch("/:id/approve", ensureAuth, approveExtension);
router.patch("/:id/reject", ensureAuth, rejectExtension);

export default router;
