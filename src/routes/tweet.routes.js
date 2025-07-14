import { Router } from 'express';
import verifyId from '../middlewares/verifyId.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { tweetValidationSchema } from '../Validations/tweet.validator.js';

import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"

// Router instance
const router = Router();

// Secured routes
router.use(verifyJWT);

// Create tweet
router.route("/").post(validate(tweetValidationSchema), createTweet);

// Get user Tweets
router.route("/my-tweets").get(getUserTweets);

// Update tweet
router.route("/:tweetId").patch(verifyId, validate(tweetValidationSchema), updateTweet);

// Delete tweet
router.route("/:tweetId").delete(verifyId, deleteTweet);

export default router