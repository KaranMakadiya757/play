import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const verifyId = asyncHandler(
    async function (req, res, next) {

        const { playlistId, videoId, channelId } = req.params;

        // Validate Video Id if provided
        if (videoId) {
            if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

            // set channel Id in the req
            req.videoId = new mongoose.Types.ObjectId(videoId);

            // find the video from DB
            const video = await Video.findById(req.videoId);

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

        // move to next 
        next();

    }
)

export default verifyId