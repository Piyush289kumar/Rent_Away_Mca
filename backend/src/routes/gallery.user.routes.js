// backend/src/routes/gallery.user.routes.js

import { Router } from "express";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { getMyLikedGalleries } from "../controllers/gallery.user.controller.js";

const router = Router();

router.get("/my/likes", ensureAuth, getMyLikedGalleries);

export default router;
