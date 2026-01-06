"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const playlist_model_1 = require("../models/playlist.model");
const video_model_1 = require("../models/video.model");
const user_model_1 = require("../models/user.model");
const comment_model_1 = require("../models/comment.model");
const tweet_model_1 = require("../models/tweet.model");
const verifyId = (0, asyncHandler_1.asyncHandler)(async function (req, res, next) {
    const { playlistId, videoId, channelId, commentId, tweetId } = req.params;
    const { videos } = req.body;
    // Validate videos array if provided
    if (Array.isArray(videos) && videos.length > 0) {
        // Check all are valid ObjectIds
        const allValid = videos.every((id) => (0, mongoose_1.isValidObjectId)(id));
        if (!allValid) {
            throw new apiError_1.ApiError(400, "Bad request", ["One or more Video IDs in the videos array are invalid"]);
        }
        // Check all videos exist in DB with a single query
        const foundVideos = await video_model_1.Video.find({ _id: { $in: videos } }, { _id: 1 });
        if (foundVideos.length !== videos.length) {
            throw new apiError_1.ApiError(404, "Bad request", ["One or more videos in the videos array do not exist"]);
        }
    }
    // Validate Video Id if provided
    if (videoId) {
        if (!(0, mongoose_1.isValidObjectId)(videoId))
            throw new apiError_1.ApiError(400, "Invalid Video ID");
        // find the video from DB
        const video = await video_model_1.Video.findById(new mongoose_1.default.Types.ObjectId(videoId));
        // throw error if video is not found
        if (!video) {
            throw new apiError_1.ApiError(404, "Video Not Found !!");
        }
        // set video in the req
        req.video = video;
    }
    // Validate PLaylist Id if provided and check for ownership
    if (playlistId) {
        if (!(0, mongoose_1.isValidObjectId)(playlistId))
            throw new apiError_1.ApiError(400, "Invalid Playlist ID");
        // find the video from DB
        const playlist = await playlist_model_1.Playlist.findById(new mongoose_1.default.Types.ObjectId(playlistId));
        // throw error if video is not found
        if (!playlist) {
            throw new apiError_1.ApiError(404, "Playlist Not Found !!");
        }
        // set video in the req
        req.playlist = playlist;
    }
    // Validate Channel Id if provided
    if (channelId) {
        if (!(0, mongoose_1.isValidObjectId)(channelId))
            throw new apiError_1.ApiError(400, "Invalid Channel ID");
        // find the channel from DB
        const channel = await user_model_1.User.findById(new mongoose_1.default.Types.ObjectId(channelId));
        // throw error if channel is not found
        if (!channel) {
            throw new apiError_1.ApiError(404, "Channel Not Found !!");
        }
        // set channel in the req
        req.channel = channel;
    }
    // Validate Comment Id if provided
    if (commentId) {
        if (!(0, mongoose_1.isValidObjectId)(commentId))
            throw new apiError_1.ApiError(400, "Invalid Comment ID");
        // find the comment from DB
        const comment = await comment_model_1.Comment.findById(new mongoose_1.default.Types.ObjectId(commentId));
        // throw error if comment is not found
        if (!comment) {
            throw new apiError_1.ApiError(404, "Comment Not Found !!");
        }
        // set comment in the req
        req.comment = comment;
    }
    // Validate Tweet Id if provided
    if (tweetId) {
        if (!(0, mongoose_1.isValidObjectId)(tweetId))
            throw new apiError_1.ApiError(400, "Invalid Tweet ID");
        // find the tweet from DB
        const tweet = await tweet_model_1.Tweet.findById(new mongoose_1.default.Types.ObjectId(tweetId));
        // throw error if tweet is not found
        if (!tweet) {
            throw new apiError_1.ApiError(404, "Tweet Not Found !!");
        }
        // set tweet in the req
        req.tweet = tweet;
    }
    // move to next
    next();
});
exports.default = verifyId;
//# sourceMappingURL=verifyId.middleware.js.map