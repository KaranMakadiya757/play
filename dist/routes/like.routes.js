"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const verifyId_middleware_1 = __importDefault(require("../middlewares/verifyId.middleware"));
const like_controller_1 = require("../controllers/like.controller");
// Router instance
const router = (0, express_1.Router)();
// Secured Routes
router.use(auth_middleware_1.verifyJWT);
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
router.route("/videos").get(like_controller_1.getLikedVideos);
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
router.route("/toggle/v/:videoId").post(verifyId_middleware_1.default, like_controller_1.toggleVideoLike);
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
router.route("/toggle/c/:commentId").post(verifyId_middleware_1.default, like_controller_1.toggleCommentLike);
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
router.route("/toggle/t/:tweetId").post(verifyId_middleware_1.default, like_controller_1.toggleTweetLike);
exports.default = router;
//# sourceMappingURL=like.routes.js.map