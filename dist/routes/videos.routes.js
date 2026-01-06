"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyId_middleware_1 = __importDefault(require("../middlewares/verifyId.middleware"));
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const video_validator_1 = require("../Validations/video.validator");
const video_controller_1 = require("../controllers/video.controller");
// Router Instance
const router = (0, express_1.Router)();
// Secured Routes
router.use(auth_middleware_1.verifyJWT);
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
router.route("/").get(video_controller_1.getAllVideos);
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
router.route("/:videoId").get(verifyId_middleware_1.default, video_controller_1.getVideoById);
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
router.route("/").post(multer_middleware_1.upload.fields([
    {
        name: "video",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
]), (0, validation_middleware_1.default)(video_validator_1.videoValidationSchema), video_controller_1.uploadVideo);
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
router.route("/:videoId").patch(verifyId_middleware_1.default, multer_middleware_1.upload.single("thumbnail"), (0, validation_middleware_1.default)(video_validator_1.videoValidationSchema), video_controller_1.updateVideo);
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
router.route("/toggle/publish/:videoId").patch(verifyId_middleware_1.default, video_controller_1.togglePublishStatus);
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
router.route("/:videoId").delete(verifyId_middleware_1.default, video_controller_1.deleteVideo);
exports.default = router;
//# sourceMappingURL=videos.routes.js.map