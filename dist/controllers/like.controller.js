"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikedVideos = exports.toggleVideoLike = exports.toggleTweetLike = exports.toggleCommentLike = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const like_model_1 = require("../models/like.model");
const getLikedVideos = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // Get liked videos
    const likedVideos = await like_model_1.Like.aggregate([
        {
            $match: {
                likedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        avatar: 1,
                                        username: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                video: { $first: "$video" },
            },
        },
        {
            $project: {
                video: 1,
            },
        },
    ]);
    // Throw Error is we get error while fetching liked videos
    if (!likedVideos) {
        throw new apiError_1.ApiError(500, "Internal Server Error !!!");
    }
    // Return respone
    return res.status(200).json(new apiResponse_1.ApiResponse(200, likedVideos, "Videos Fetched SuccessFully"));
});
exports.getLikedVideos = getLikedVideos;
const toggleVideoLike = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    // Create a Like object
    const likeobj = {
        likedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        video: (_b = req.video) === null || _b === void 0 ? void 0 : _b._id,
    };
    // Check Wheather the like is added or not
    const like = await like_model_1.Like.findOne(likeobj);
    // Toggle the like
    if (!like) {
        // Add Like
        const newLike = await like_model_1.Like.create(likeobj);
        // Throw error
        if (!newLike)
            throw new apiError_1.ApiError(500, "Something went wrong while adding like");
        // Return response
        return res.status(201).json(new apiResponse_1.ApiResponse(200, {}, "Added like to video"));
    }
    else {
        // remove the subscription
        const removedLike = await like_model_1.Like.deleteOne(likeobj);
        // Throw Error
        if (!removedLike)
            throw new apiError_1.ApiError(500, "Something went wrong while removing like");
        // Return Response
        return res.status(201).json(new apiResponse_1.ApiResponse(200, {}, "Like removed from video"));
    }
});
exports.toggleVideoLike = toggleVideoLike;
const toggleCommentLike = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    // Create a Like object
    const likeobj = {
        likedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        comment: (_b = req.comment) === null || _b === void 0 ? void 0 : _b._id,
    };
    // Check Wheather the like is added or not
    const like = await like_model_1.Like.findOne(likeobj);
    // Toggle the like
    if (!like) {
        // Add Like
        const newLike = await like_model_1.Like.create(likeobj);
        // Throw error
        if (!newLike)
            throw new apiError_1.ApiError(500, "Something went wrong while adding like");
        // Return response
        return res.status(201).json(new apiResponse_1.ApiResponse(200, {}, "Added like to comment"));
    }
    else {
        // remove the subscription
        const removedLike = await like_model_1.Like.deleteOne(likeobj);
        // Throw Error
        if (!removedLike)
            throw new apiError_1.ApiError(500, "Something went wrong while removing like");
        // Return Response
        return res.status(201).json(new apiResponse_1.ApiResponse(200, {}, "Like removed from comment"));
    }
});
exports.toggleCommentLike = toggleCommentLike;
const toggleTweetLike = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    // Create a Like object
    const likeobj = {
        likedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        tweet: (_b = req.tweet) === null || _b === void 0 ? void 0 : _b._id,
    };
    // Check Wheather the like is added or not
    const like = await like_model_1.Like.findOne(likeobj);
    // Toggle the like
    if (!like) {
        // Add Like
        const newLike = await like_model_1.Like.create(likeobj);
        // Throw error
        if (!newLike)
            throw new apiError_1.ApiError(500, "Something went wrong while adding like");
        // Return response
        return res.status(201).json(new apiResponse_1.ApiResponse(200, {}, "Added like to tweet"));
    }
    else {
        // remove the subscription
        const removedLike = await like_model_1.Like.deleteOne(likeobj);
        // Throw Error
        if (!removedLike)
            throw new apiError_1.ApiError(500, "Something went wrong while removing like");
        // Return Response
        return res.status(201).json(new apiResponse_1.ApiResponse(200, {}, "Like removed from tweet"));
    }
});
exports.toggleTweetLike = toggleTweetLike;
//# sourceMappingURL=like.controller.js.map