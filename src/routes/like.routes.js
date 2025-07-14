import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import verifyId from "../middlewares/verifyId.middleware.js";

import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"

// Router instance
const router = Router();

// Secured Routes
router.use(verifyJWT);

// Get all liked videos
router.route("/videos").get(getLikedVideos);

// Toggle Video likes
router.route("/toggle/v/:videoId").post(verifyId, toggleVideoLike);

// Toggle Comment likes
router.route("/toggle/c/:commentId").post(verifyId, toggleCommentLike);

// Toggle Tweet likes
router.route("/toggle/t/:tweetId").post(verifyId, toggleTweetLike);

export default router