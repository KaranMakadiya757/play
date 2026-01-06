"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyId_middleware_1 = __importDefault(require("../middlewares/verifyId.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const subscription_controller_1 = require("../controllers/subscription.controller");
// Router Instance
const router = (0, express_1.Router)();
// Secured Routes
router.use(auth_middleware_1.verifyJWT);
/** Get Subscribers
 *
 * @swagger
 * /subscription/my-subscribers:
 *   get:
 *     summary: Get all subscribers for the current user
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetSubscribersResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.route("/my-subscribers").get(subscription_controller_1.getUserChannelSubscribers);
/** Get Subscribed Channels
 *
 * @swagger
 * /subscription/my-subscriptions:
 *   get:
 *     summary: Get all channels the user is subscribed to
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetSubscriptionsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.route("/my-subscriptions").get(subscription_controller_1.getSubscribedChannels);
/** Toggle Subscription
 *
 * @swagger
 * /subscription/c/{channelId}:
 *   post:
 *     summary: Toggle subscription to a channel
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: string
 *         required: true
 *         description: Channel ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ToggleSubscriptionResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/c/:channelId").post(verifyId_middleware_1.default, subscription_controller_1.toggleSubscription);
exports.default = router;
//# sourceMappingURL=subscription.routes.js.map