import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import subscriptionHandler from '../middlewares/subscription.middleware.js';

// Router Instance
const router = Router();

// Secured Routes
router.use(verifyJWT);

// Get Subscribers
router.route("/c/:channelId").get(subscriptionHandler, getUserChannelSubscribers)

// Get Subscribed Channels 
router.route("/u/:subscriberId").get(subscriptionHandler, getSubscribedChannels);

// Toggle Subscription
router.route("/c/:channelId").post(subscriptionHandler, toggleSubscription);


export default router