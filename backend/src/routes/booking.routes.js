// src/routes/booking.routes.js

import { Router } from "express";
import {
  createBooking,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/booking.controller.js";

import { ensureAuth } from "../middleware/authMiddleware.js";

const router = Router();

/* ===========================
   🟢 GUEST
=========================== */
router.post("/", ensureAuth, createBooking);

/* ===========================
   🔒 HOST
=========================== */
router.patch("/:id/status", ensureAuth, updateBookingStatus);

/* ===========================
   ❌ CANCEL
=========================== */
router.delete("/:id", ensureAuth, cancelBooking);

export default router;
