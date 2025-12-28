import mongoose from "mongoose";

const mediaFileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    format: {
      type: String, // mp4, mp3, webp, jpg
      required: true,
      lowercase: true,
    },
    quality: {
      type: String, // 1080p, 720p, original
      default: "original",
    },
    size: {
      type: Number, // in bytes
      default: 0,
    },
  },
  { _id: false }
);

const gallerySchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 20000,
      default: null,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    /* ================= MEDIA ================= */
    mediaType: {
      type: String,
      enum: ["image", "video", "audio"],
      required: true,
    },

    thumbnail: {
      type: String,
      default: null,
    },

    mediaFiles: {
      type: [mediaFileSchema],
      validate: [(v) => v.length > 0, "At least one media file is required"],
    },

    /* ================= STATS ================= */
    stats: {
      likes: {
        type: Number,
        default: 0,
      },
      favorites: {
        type: Number,
        default: 0,
      },
      downloads: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      views: {
        type: Number,
        default: 0,
      },
    },

    /* ================= SYSTEM ================= */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "galleries",
  }
);

/* ================= INDEXES ================= */
gallerySchema.index({ isActive: 1, createdAt: -1 });
gallerySchema.index({ mediaType: 1 });
gallerySchema.index({ "stats.downloads": -1 });
gallerySchema.index({ "stats.likes": -1 });

/* ================= VIRTUALS ================= */
gallerySchema.virtual("publicThumbnail").get(function () {
  return (
    this.thumbnail ||
    "https://via.placeholder.com/400x300?text=No+Preview"
  );
});

/* ================= STATICS ================= */
gallerySchema.statics.fetchActive = function ({
  limit = 20,
  mediaType,
} = {}) {
  const filter = { isActive: true };
  if (mediaType) filter.mediaType = mediaType;

  return this.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("title mediaType thumbnail stats createdAt")
    .lean();
};

/* ================= METHODS ================= */
gallerySchema.methods.incrementStat = async function (field) {
  this.stats[field] += 1;
  await this.save();
  return this.stats[field];
};

/* ================= MIDDLEWARE ================= */
gallerySchema.pre("save", function (next) {
  if (this.title) {
    this.title = this.title
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  next();
});

gallerySchema.post("save", function (doc) {
  console.info(`Gallery saved: ${doc.title} (${doc._id})`);
});

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
