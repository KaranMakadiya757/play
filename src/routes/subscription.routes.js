import { Router } from 'express';
import verifyId from '../middlewares/verifyId.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"

// Router Instance
const router = Router();

// Secured Routes
router.use(verifyJWT);

/**
 * @swagger
 * /subscription/my-subscribers:
 *   get:
 *     summary: Get all subscribers for the current user
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: List of subscribers fetched successfully
 */
// Get Subscribers
router.route("/my-subscribers").get(getUserChannelSubscribers)

/**
 * @swagger
 * /subscription/my-subscriptions:
 *   get:
 *     summary: Get all channels the user is subscribed to
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: List of subscriptions fetched successfully
 */
// Get Subscribed Channels 
router.route("/my-subscriptions").get(getSubscribedChannels);

/**
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
 *         description: Subscription toggled successfully
 *       404:
 *         description: Channel not found
 */
// Toggle Subscription
router.route("/c/:channelId").post(verifyId, toggleSubscription);


export default router