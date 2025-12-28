import { Router } from "express";
import { ensureAuth } from "../middleware/authMiddleware.js";

import {
  likeGallery,
  unlikeGallery,
  favoriteGallery,
  unfavoriteGallery,
  downloadGalleryMedia,
  shareGallery,
  getMyLikedGalleries,
  getMyFavoriteGalleries,
} from "../controllers/gallery.action.controller.js";

const router = Router();

/* ================================
   🟢 USER ACTION ROUTES
================================ */

// ❤️ Like / Unlike
router.post("/:id/like", ensureAuth, likeGallery);
router.delete("/:id/like", ensureAuth, unlikeGallery);

// ❤️ My Likes
router.get("/me/likes", ensureAuth, getMyLikedGalleries);

// ⭐ My Favorites
router.get("/me/favorites", ensureAuth, getMyFavoriteGalleries);

// ⭐ Favorite / Unfavorite
router.post("/:id/favorite", ensureAuth, favoriteGallery);
router.delete("/:id/favorite", ensureAuth, unfavoriteGallery);

router.post("/:id/view", async (req, res) => {
  await Gallery.findByIdAndUpdate(req.params.id, {
    $inc: { "stats.views": 1 },
  });
  res.json({ success: true });
});

// 📥 Download
router.post("/:id/download", ensureAuth, downloadGalleryMedia);

// 🔗 Share
router.post("/:id/share", ensureAuth, shareGallery);

export default router;
