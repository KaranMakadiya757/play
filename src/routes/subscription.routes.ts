import { Router } from "express";
import verifyId from "../middlewares/verifyId.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller";

// Router Instance
const router = Router();

// Secured Routes
router.use(verifyJWT);

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
router.route("/my-subscribers").get(getUserChannelSubscribers);

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
router.route("/my-subscriptions").get(getSubscribedChannels);

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
router.route("/c/:channelId").post(verifyId, toggleSubscription);

export default router;
