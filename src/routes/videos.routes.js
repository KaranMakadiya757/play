import { Router } from 'express';
import verifyId from '../middlewares/verifyId.middleware.js';
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from '../middlewares/validation.middleware.js';
import { videoValidationSchema } from '../Validations/video.validator.js';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    uploadVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"


// Router Instance
const router = Router();

// Secured Routes
router.use(verifyJWT);

/**
 * @swagger
 * /video:
 *   get:
 *     summary: Get all videos
 *     tags: [Video]
 *     responses:
 *       200:
 *         description: List of videos fetched successfully
 */
// Get All Videos
router.route("/").get(getAllVideos)

/**
 * @swagger
 * /video:
 *   post:
 *     summary: Upload a new video
 *     tags: [Video]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: My Video
 *               description:
 *                 type: string
 *                 example: Video description
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       400:
 *         description: Bad request
 */
// Upload a Video
router.route("/").post(
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    validate(videoValidationSchema),
    uploadVideo
);

/**
 * @swagger
 * /video/{videoId}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video fetched successfully
 *       404:
 *         description: Video not found
 */
// Get Video By ID
router.route("/:videoId").get(verifyId, getVideoById);

/**
 * @swagger
 * /video/{videoId}:
 *   patch:
 *     summary: Update video by ID
 *     tags: [Video]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: Updated Video Title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               isPublished:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Video updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Video not found
 */
// Update Video By ID
router.route("/:videoId").patch(
    verifyId,
    upload.single("thumbnail"),
    validate(videoValidationSchema),
    updateVideo
);

/**
 * @swagger
 * /video/toggle/publish/{videoId}:
 *   patch:
 *     summary: Toggle publish status of a video
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video publish status toggled successfully
 *       404:
 *         description: Video not found
 */
// Toggle Publish
router.route("/toggle/publish/:videoId").patch(verifyId, togglePublishStatus);

/**
 * @swagger
 * /video/{videoId}:
 *   delete:
 *     summary: Delete video by ID
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Video not found
 */
// Delete Video By ID
router.route("/:videoId").delete(verifyId, deleteVideo);


export default router