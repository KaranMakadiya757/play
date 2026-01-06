"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTweet = exports.updateTweet = exports.getUserTweets = exports.createTweet = void 0;
const tweet_model_1 = require("../models/tweet.model");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
// Get all user tweets
const getUserTweets = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // create aggreagation pipeline for comments
    const tweets = await tweet_model_1.Tweet.aggregate([
        {
            $match: {
                owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
            },
        },
        {
            $addFields: {
                likes: { $size: "$likes" },
            },
        },
    ]);
    // Throw error if comments are not found
    if (!tweets)
        throw new apiError_1.ApiError(500, "Internal server error");
    // return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, tweets, "Tweets fetched sucessfully"));
});
exports.getUserTweets = getUserTweets;
// Create Tweet
const createTweet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // Set owner id in request body
    req.body.owner = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // Create tweet
    const createdTweet = await tweet_model_1.Tweet.create(req.body);
    // Throw Error is comment is not created
    if (!createdTweet) {
        throw new apiError_1.ApiError(500, "Internal Server Error !!!");
    }
    // Return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, createdTweet, "Tweet added successfully"));
});
exports.createTweet = createTweet;
// Update Tweet
const updateTweet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e;
    // check the ownership
    if (((_b = (_a = req.tweet) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Tweet !!!");
    }
    // Find the Tweet by ID and Update
    const updatedTweet = await tweet_model_1.Tweet.findByIdAndUpdate((_e = req.tweet) === null || _e === void 0 ? void 0 : _e._id, req.body, { new: true });
    // Throw error is something goes wrong while updating tweet
    if (!updatedTweet) {
        throw new apiError_1.ApiError(500, "Internal Server Error !!!");
    }
    // Return Response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});
exports.updateTweet = updateTweet;
// Delete Tweet
const deleteTweet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e;
    // check the ownership
    if (((_b = (_a = req.tweet) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Tweet !!!");
    }
    // Delete Comment
    const deletedTweet = await tweet_model_1.Tweet.findByIdAndDelete((_e = req.tweet) === null || _e === void 0 ? void 0 : _e._id);
    // Throw error is something goes wrong while deleting comment
    if (!deletedTweet) {
        throw new apiError_1.ApiError(500, "Internal Server Error !!!");
    }
    // Return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {}, "Tweet deleted successfully"));
});
exports.deleteTweet = deleteTweet;
//# sourceMappingURL=tweet.controller.js.map