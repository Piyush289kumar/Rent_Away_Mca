import GalleryLike from "../models/actions/galleryLike.model.js";
import GalleryFavorite from "../models/actions/galleryFavorite.model.js";
import GalleryDownload from "../models/actions/galleryDownload.model.js";
import Gallery from "../models/gallery.model.js";

/* ================================
   CONSTANTS
================================ */
const ALLOWED_FORMATS = ["mp4", "mp3", "jpg", "jpeg", "png", "webp"];
const ALLOWED_QUALITIES = ["original", "1080p", "720p", "480p"];

/* ================================
   ❤️ LIKE / UNLIKE
================================ */

/**
 * Like a gallery (idempotent)
 */
export const likeGallery = async (req, res) => {
  const { id } = req.params;

  const existing = await GalleryLike.findOne({
    user: req.user._id,
    gallery: id,
  });

  // TOGGLE → UNLIKE
  if (existing) {
    await GalleryLike.deleteOne({ _id: existing._id });
    const gallery = await Gallery.findByIdAndUpdate(
      id,
      { $inc: { "stats.likes": -1 } },
      { new: true }
    );

    return res.json({
      success: true,
      liked: false,
      stats: gallery.stats,
    });
  }

  // LIKE
  await GalleryLike.create({ user: req.user._id, gallery: id });
  const gallery = await Gallery.findByIdAndUpdate(
    id,
    { $inc: { "stats.likes": 1 } },
    { new: true }
  );

  res.json({
    success: true,
    liked: true,
    stats: gallery.stats,
  });
};

/**
 * Unlike gallery
 */
export const unlikeGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await GalleryLike.findOneAndDelete({
      user: req.user._id,
      gallery: id,
    });

    if (deleted) {
      await Gallery.findByIdAndUpdate(id, {
        $inc: { "stats.likes": -1 },
      });
    }

    res.json({ success: true, message: "Gallery unliked" });
  } catch (error) {
    console.error("Unlike error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ================================
   ⭐ FAVORITE / UNFAVORITE
================================ */

/**
 * Add to favorites (idempotent)
 */
export const favoriteGallery = async (req, res) => {
  const { id } = req.params;

  const existing = await GalleryFavorite.findOne({
    user: req.user._id,
    gallery: id,
  });

  if (existing) {
    await GalleryFavorite.deleteOne({ _id: existing._id });
    const gallery = await Gallery.findByIdAndUpdate(
      id,
      { $inc: { "stats.favorites": -1 } },
      { new: true }
    );

    return res.json({
      success: true,
      favorited: false,
      stats: gallery.stats,
    });
  }

  await GalleryFavorite.create({ user: req.user._id, gallery: id });
  const gallery = await Gallery.findByIdAndUpdate(
    id,
    { $inc: { "stats.favorites": 1 } },
    { new: true }
  );

  res.json({
    success: true,
    favorited: true,
    stats: gallery.stats,
  });
};

/**
 * Remove from favorites
 */
export const unfavoriteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const removed = await GalleryFavorite.findOneAndDelete({
      user: req.user._id,
      gallery: id,
    });

    if (removed) {
      await Gallery.findByIdAndUpdate(id, {
        $inc: { "stats.favorites": -1 },
      });
    }

    res.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    console.error("Unfavorite error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ================================
   📥 DOWNLOAD (FORMAT + QUALITY)
================================ */

/**
 * Log download
 */
export const downloadGalleryMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = "original", quality = "original" } = req.body;

    // Validate format & quality
    if (
      !ALLOWED_FORMATS.includes(format) ||
      !ALLOWED_QUALITIES.includes(quality)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid format or quality",
      });
    }

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    await GalleryDownload.create({
      user: req.user._id,
      gallery: id,
      format,
      quality,
    });

    await Gallery.findByIdAndUpdate(id, {
      $inc: { "stats.downloads": 1 },
    });

    res.json({
      success: true,
      message: "Download logged successfully",
      data: { format, quality },
    });
  } catch (error) {
    console.error("Download error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* ================================
   🔗 SHARE
================================ */

/**
 * Share count
 */
export const shareGallery = async (req, res) => {
  try {
    const { id } = req.params;

    await Gallery.findByIdAndUpdate(id, {
      $inc: { "stats.shares": 1 },
    });

    res.json({ success: true, message: "Share counted" });
  } catch (error) {
    console.error("Share error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyLikedGalleries = async (req, res) => {
  const likes = await GalleryLike.find({ user: req.user._id })
    .populate({
      path: "gallery",
      populate: { path: "category", select: "name" },
    })
    .lean();

  res.json({
    success: true,
    data: likes.map((l) => l.gallery),
  });
};

export const getMyFavoriteGalleries = async (req, res) => {
  const favorites = await GalleryFavorite.find({ user: req.user._id })
    .populate({
      path: "gallery",
      populate: { path: "category", select: "name" },
    })
    .lean();

  res.json({
    success: true,
    data: favorites.map((f) => f.gallery),
  });
};
