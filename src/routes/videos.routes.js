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

// Get All Videos
router.route("/").get(getAllVideos)

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

// Get Video By ID
router.route("/:videoId").get(verifyId, getVideoById);

// Update Video By ID
router.route("/:videoId").patch(
    verifyId,
    upload.single("thumbnail"),
    validate(videoValidationSchema),
    updateVideo
);

// Toggle Publish
router.route("/toggle/publish/:videoId").patch(verifyId, togglePublishStatus);

// Delete Video By ID
router.route("/:videoId").delete(verifyId, deleteVideo);


export default router