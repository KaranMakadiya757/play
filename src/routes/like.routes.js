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

/**
 * @swagger
 * /like/videos:
 *   get:
 *     summary: Get all liked videos
 *     tags: [Like]
 *     responses:
 *       200:
 *         description: List of liked videos fetched successfully
 */
// Get all liked videos
router.route("/videos").get(getLikedVideos);

/**
 * @swagger
 * /like/toggle/v/{videoId}:
 *   post:
 *     summary: Toggle like on a video
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *       404:
 *         description: Video not found
 */
// Toggle Video likes
router.route("/toggle/v/:videoId").post(verifyId, toggleVideoLike);

/**
 * @swagger
 * /like/toggle/c/{commentId}:
 *   post:
 *     summary: Toggle like on a comment
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *       404:
 *         description: Comment not found
 */
// Toggle Comment likes
router.route("/toggle/c/:commentId").post(verifyId, toggleCommentLike);

/**
 * @swagger
 * /like/toggle/t/{tweetId}:
 *   post:
 *     summary: Toggle like on a tweet
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         schema:
 *           type: string
 *         required: true
 *         description: Tweet ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *       404:
 *         description: Tweet not found
 */
// Toggle Tweet likes
router.route("/toggle/t/:tweetId").post(verifyId, toggleTweetLike);

export default router