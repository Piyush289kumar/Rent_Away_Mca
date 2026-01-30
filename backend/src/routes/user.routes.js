import { Router } from "express";
import {
  getPublicUserProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  partiallyUpdateUser,
  deleteUserById,
  getMe,
} from "../controllers/user.controller.js";

import { ensureAuth } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = Router();


/* ================================
   🔒 AUTH USER
================================ */

/**
 * Get logged-in user
 * GET /users/me
 */
router.get("/me", ensureAuth, getMe);



/* ================================
   🟢 PUBLIC ROUTES
================================ */

/**
 * View public user profile (no password)
 * GET /users/:id
 */
router.get("/:id", getPublicUserProfile);

/* ================================
   🔒 ADMIN ROUTES
================================ */

/**
 * Get all users (admin)
 * GET /users/admin/all
 */
router.get("/admin/all", ensureAuth,  getAllUsers);

/**
 * Get single user by id (admin)
 * GET /users/admin/:id
 */
router.get("/admin/:id", ensureAuth,  getUserById);

/**
 * Create new user (admin)
 * POST /users/admin
 */
router.post(
  "/admin",
  ensureAuth,
  
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  createUser
);

/**
 * Full update user (PUT)
 * PUT /users/admin/:id
 */
router.put(
  "/admin/:id",
  ensureAuth,
  
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  updateUser
);

/**
 * Partial update user (PATCH)
 * PATCH /users/admin/:id
 */
router.patch(
  "/admin/:id",
  ensureAuth,
  
  partiallyUpdateUser
);

/**
 * Delete user
 * DELETE /users/admin/:id
 */
router.delete("/admin/:id", ensureAuth,  deleteUserById);

export default router;
