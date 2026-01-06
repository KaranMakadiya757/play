"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT); // Apply verifyJWT middleware to all routes in this file
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
router.route("/stats").get(dashboard_controller_1.getChannelStats);
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
router.route("/videos").get(dashboard_controller_1.getChannelVideos);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map