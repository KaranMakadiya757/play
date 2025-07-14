import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

const verifyId = asyncHandler(
    async function (req, res, next) {

        const { playlistId, videoId, channelId, commentId } = req.params;

        // Validate Video Id if provided
        if (videoId) {
            if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

            // find the video from DB
            const video = await Video.findById(new mongoose.Types.ObjectId(videoId));

            // throw error if video is not found
            if (!video) {
                throw new ApiError(404, "Video Not Found !!");
            }

            // check the ownership
            if (video.owner?.toString() !== req.user._id?.toString()) {
                throw new ApiError(403, "You Don't have access to this Video !!!");
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

            // check the ownership
            if (playlist.owner?.toString() !== req.user._id?.toString()) {
                throw new ApiError(403, "You Don't have access to this Resource !!!");
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

            // check the ownership
            if (comment.owner?.toString() !== req.user._id?.toString()) {
                throw new ApiError(403, "You Don't have access to this Comment !!!");
            }

            // set comment in the req
            req.comment = comment;
        }

        // move to next 
        next();

    }
)

export default verifyId