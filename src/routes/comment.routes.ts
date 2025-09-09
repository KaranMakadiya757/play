import { Router } from "express";
import verifyId from "../middlewares/verifyId.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { commentValidationSchema } from "../Validations/comment.validator";

import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller";

// Router Instance
const router = Router();

// Secured Routes
router.use(verifyJWT);

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
router.route("/:videoId").get(verifyId, getVideoComments);

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
router.route("/:videoId").post(verifyId, validate(commentValidationSchema), addComment);

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
router.route("/:commentId").patch(verifyId, validate(commentValidationSchema), updateComment);

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
router.route("/:commentId").delete(verifyId, deleteComment);

export default router;
