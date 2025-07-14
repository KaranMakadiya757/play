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

// Get Subscribers
router.route("/my-subscribers").get(getUserChannelSubscribers)

// Get Subscribed Channels 
router.route("/my-subscriptions").get(getSubscribedChannels);

// Toggle Subscription
router.route("/c/:channelId").post(verifyId, toggleSubscription);


export default router