import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import verifyId from "../middlewares/verifyId.middleware";

import { getLikedVideos, toggleCommentLike, toggleVideoLike, toggleTweetLike } from "../controllers/like.controller";

// Router instance
const router = Router();

// Secured Routes
router.use(verifyJWT);

/** Get all liked videos
 *
 * @swagger
 * /like/videos:
 *   get:
 *     summary: Get all liked videos
 *     tags: [Like]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetLikedVideosResponse'
 */
router.route("/videos").get(getLikedVideos);

/** Toggle Video likes
 *
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
 *         $ref: '#/components/responses/ToggleVideoLikeResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/toggle/v/:videoId").post(verifyId, toggleVideoLike);

/** Toggle Comment likes
 *
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
 *         $ref: '#/components/responses/ToggleCommentLikeResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/toggle/c/:commentId").post(verifyId, toggleCommentLike);

/** Toggle Tweet likes
 *
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
 *         $ref: '#/components/responses/ToggleTweetLikeResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/toggle/t/:tweetId").post(verifyId, toggleTweetLike);

export default router;
