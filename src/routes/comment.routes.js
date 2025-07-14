import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"

// Router Instance
const router = Router();

// Secured Routes
router.use(verifyJWT);

// Get video Comments
router.route("/").get(getVideoComments);
router.route("/:videoId").get(getVideoComments);

// Add Comment in video
router.route("/:videoId").post(addComment);

// Update Comment
router.route("/c/:commentId").patch(updateComment);

// Delete Comment
router.route("/c/:commentId").delete(deleteComment);

export default router