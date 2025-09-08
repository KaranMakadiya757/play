import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Playlist } from "../models/playlist.model";
import { Video } from "../models/video.model";
import { User } from "../models/user.model";
import { Comment } from "../models/comment.model";
import { Tweet } from "../models/tweet.model";

const verifyId = asyncHandler(async function (req, res, next) {
    const { playlistId, videoId, channelId, commentId, tweetId } = req.params;
    const { videos } = req.body;

    // Validate videos array if provided
    if (Array.isArray(videos) && videos.length > 0) {
        // Check all are valid ObjectIds
        const allValid = videos.every((id) => isValidObjectId(id));
        if (!allValid) {
            throw new ApiError(400, "Bad request", ["One or more Video IDs in the videos array are invalid"]);
        }

        // Check all videos exist in DB with a single query
        const foundVideos = await Video.find({ _id: { $in: videos } }, { _id: 1 });
        if (foundVideos.length !== videos.length) {
            throw new ApiError(404, "Bad request", ["One or more videos in the videos array do not exist"]);
        }
    }

    // Validate Video Id if provided
    if (videoId) {
        if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

        // find the video from DB
        const video = await Video.findById(new mongoose.Types.ObjectId(videoId));

        // throw error if video is not found
        if (!video) {
            throw new ApiError(404, "Video Not Found !!");
        }

        // set video in the req
        req.video = video;
    }

    // Validate PLaylist Id if provided and check for ownership
    if (playlistId) {
        if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid Playlist ID");

        // find the video from DB
        const playlist = await Playlist.findById(new mongoose.Types.ObjectId(playlistId));

        // throw error if video is not found
        if (!playlist) {
            throw new ApiError(404, "Playlist Not Found !!");
        }

        // set video in the req
        req.playlist = playlist;
    }

    // Validate Channel Id if provided
    if (channelId) {
        if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid Channel ID");

        // find the channel from DB
        const channel = await User.findById(new mongoose.Types.ObjectId(channelId));

        // throw error if channel is not found
        if (!channel) {
            throw new ApiError(404, "Channel Not Found !!");
        }

        // set channel in the req
        req.channel = channel;
    }

    // Validate Comment Id if provided
    if (commentId) {
        if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid Comment ID");

        // find the comment from DB
        const comment = await Comment.findById(new mongoose.Types.ObjectId(commentId));

        // throw error if comment is not found
        if (!comment) {
            throw new ApiError(404, "Comment Not Found !!");
        }

        // set comment in the req
        req.comment = comment;
    }

    // Validate Tweet Id if provided
    if (tweetId) {
        if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid Tweet ID");

        // find the tweet from DB
        const tweet = await Tweet.findById(new mongoose.Types.ObjectId(tweetId));

        // throw error if tweet is not found
        if (!tweet) {
            throw new ApiError(404, "Tweet Not Found !!");
        }

        // set tweet in the req
        req.tweet = tweet;
    }

    // move to next
    next();
});

export default verifyId;
