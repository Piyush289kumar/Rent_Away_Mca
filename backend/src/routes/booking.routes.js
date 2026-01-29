// src/routes/booking.routes.js

import { Router } from "express";
import {
  /* CUSTOMER */
  createBooking,
  getMyBookings,
  cancelBooking,

  /* ADMIN */
  getAllBookings,
  getBookingById,
  deleteBooking,
} from "../controllers/booking.controller.js";

import { ensureAuth } from "../middleware/authMiddleware.js";

const router = Router();

/* ================================
   🟢 CUSTOMER (GUEST)
================================ */

/**
 * Create booking
 * POST /bookings
 */
router.post("/", ensureAuth, createBooking);

/**
 * Get logged-in user's bookings
 * GET /bookings/me
 */
router.get("/me", ensureAuth, getMyBookings);

/**
 * Cancel booking (only own booking)
 * DELETE /bookings/:id
 */
router.delete("/:id", ensureAuth, cancelBooking);

/* ================================
   🔒 ADMIN
================================ */

/**
 * Get all bookings
 * GET /bookings/admin/all
 */
router.get("/admin/all", ensureAuth, getAllBookings);

/**
 * Get booking by id
 * GET /bookings/admin/:id
 */
router.get("/admin/:id", ensureAuth, getBookingById);

/**
 * Delete booking
 * DELETE /bookings/admin/:id
 */
router.delete("/admin/:id", ensureAuth, deleteBooking);

export default router;
