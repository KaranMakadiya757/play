"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyId_middleware_1 = __importDefault(require("../middlewares/verifyId.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const tweet_validator_1 = require("../Validations/tweet.validator");
const tweet_controller_1 = require("../controllers/tweet.controller");
// Router instance
const router = (0, express_1.Router)();
// Secured routes
router.use(auth_middleware_1.verifyJWT);
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
router.route("/my-tweets").get(tweet_controller_1.getUserTweets);
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
router.route("/").post((0, validation_middleware_1.default)(tweet_validator_1.tweetValidationSchema), tweet_controller_1.createTweet);
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
router.route("/:tweetId").patch(verifyId_middleware_1.default, (0, validation_middleware_1.default)(tweet_validator_1.tweetValidationSchema), tweet_controller_1.updateTweet);
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
router.route("/:tweetId").delete(verifyId_middleware_1.default, tweet_controller_1.deleteTweet);
exports.default = router;
//# sourceMappingURL=tweet.routes.js.map