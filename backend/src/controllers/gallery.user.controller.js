import GalleryLike from "../models/actions/galleryLike.model.js";
import Gallery from "../models/gallery.model.js";

export const getMyLikedGalleries = async (req, res) => {
  try {
    const userId = req.user._id;

    const likes = await GalleryLike.find({ user: userId })
      .populate({
        path: "gallery",
        match: { isActive: true },
        populate: { path: "category", select: "name slug" },
      })
      .sort({ createdAt: -1 })
      .lean();

    // extract gallery objects
    const galleries = likes.map((l) => l.gallery).filter(Boolean);

    res.json({
      success: true,
      data: galleries,
    });
  } catch (err) {
    console.error("Get likes error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch liked galleries",
    });
  }
};
