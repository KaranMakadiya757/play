import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

/** Get channel stats
 *
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get channel statistics for current user
 *     tags: [User]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetChannelStatsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.route("/stats").get(getChannelStats);

/** Get channel videos
 *
 * @swagger
 * /dashboard/videos:
 *   get:
 *     summary: Get channel videos for current user
 *     tags: [User]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetChannelVideosResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.route("/videos").get(getChannelVideos);

export default router;
