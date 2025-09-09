import { Router } from "express";
import verifyId from "../middlewares/verifyId.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { tweetValidationSchema } from "../Validations/tweet.validator";

import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller";

// Router instance
const router = Router();

// Secured routes
router.use(verifyJWT);

/** Get user Tweets
 *
 * @swagger
 * /tweet/my-tweets:
 *   get:
 *     summary: Get all tweets for the current user
 *     tags: [Tweet]
 *     responses:
 *       200:
 *         description: List of tweets fetched successfully
 */
router.route("/my-tweets").get(getUserTweets);

/** Create tweet
 *
 * @swagger
 * /tweet:
 *   post:
 *     summary: Create a new tweet
 *     tags: [Tweet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTweetRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreateTweetResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.route("/").post(validate(tweetValidationSchema), createTweet);

/** Update tweet
 *
 * @swagger
 * /tweet/{tweetId}:
 *   patch:
 *     summary: Update a tweet
 *     tags: [Tweet]
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         schema:
 *           type: string
 *         required: true
 *         description: Tweet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTweetRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdateTweetResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:tweetId").patch(verifyId, validate(tweetValidationSchema), updateTweet);

/** Delete tweet
 *
 * @swagger
 * /tweet/{tweetId}:
 *   delete:
 *     summary: Delete a tweet
 *     tags: [Tweet]
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         schema:
 *           type: string
 *         required: true
 *         description: Tweet ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/DeleteTweetResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:tweetId").delete(verifyId, deleteTweet);

export default router;
