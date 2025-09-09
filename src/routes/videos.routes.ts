import { Router } from "express";
import verifyId from "../middlewares/verifyId.middleware";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { videoValidationSchema } from "../Validations/video.validator";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    uploadVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller";

// Router Instance
const router = Router();

// Secured Routes
router.use(verifyJWT);

/** Get All Videos
 *
 * @swagger
 * /video:
 *   get:
 *     summary: Get all videos
 *     tags: [Video]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetVideosResponse'
 */
router.route("/").get(getAllVideos);

/** Get Video By ID
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
 *         $ref: '#/components/responses/GetVideoResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:videoId").get(verifyId, getVideoById);

/** Upload a Video
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
 *             $ref: '#/components/schemas/UploadVideoRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/UploadVideoResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.route("/").post(
    upload.fields([
        {
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    validate(videoValidationSchema),
    uploadVideo
);

/** Update Video By ID
 *
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
 *             $ref: '#/components/schemas/UpdateVideoRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateVideoResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:videoId").patch(verifyId, upload.single("thumbnail"), validate(videoValidationSchema), updateVideo);

/** Toggle Publish
 *
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
 *         $ref: '#/components/responses/TogglePublishResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/toggle/publish/:videoId").patch(verifyId, togglePublishStatus);

/** Delete Video By ID
 *
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
 *         $ref: '#/components/responses/DeleteVideoResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:videoId").delete(verifyId, deleteVideo);

export default router;
