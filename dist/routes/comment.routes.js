"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyId_middleware_1 = __importDefault(require("../middlewares/verifyId.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const comment_validator_1 = require("../Validations/comment.validator");
const comment_controller_1 = require("../controllers/comment.controller");
// Router Instance
const router = (0, express_1.Router)();
// Secured Routes
router.use(auth_middleware_1.verifyJWT);
/** Get video Comments
 *
 * @swagger
 * /comment/{videoId}:
 *   get:
 *     summary: Get comments for a video
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetVideoCommentsResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:videoId").get(verifyId_middleware_1.default, comment_controller_1.getVideoComments);
/** Add Comment in video
 *
 * @swagger
 * /comment/{videoId}:
 *   post:
 *     summary: Add a comment to a video
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCommentRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/AddCommentResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.route("/:videoId").post(verifyId_middleware_1.default, (0, validation_middleware_1.default)(comment_validator_1.commentValidationSchema), comment_controller_1.addComment);
/** Update Comment
 *
 * @swagger
 * /comment/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateCommentResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:commentId").patch(verifyId_middleware_1.default, (0, validation_middleware_1.default)(comment_validator_1.commentValidationSchema), comment_controller_1.updateComment);
/** Delete Comment
 *
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DeleteCommentResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:commentId").delete(verifyId_middleware_1.default, comment_controller_1.deleteComment);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map