import { Router } from 'express';
import verifyId from '../middlewares/verifyId.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { commentValidationSchema } from '../Validations/comment.validator.js';

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
router.route("/:videoId").get(verifyId, getVideoComments);

// Add Comment in video
router.route("/:videoId").post(verifyId, validate(commentValidationSchema), addComment);

// Update Comment
router.route("/:commentId").patch(verifyId, validate(commentValidationSchema), updateComment);

// Delete Comment
router.route("/:commentId").delete(verifyId, deleteComment);

export default router