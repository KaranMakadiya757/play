import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const playlistHandler = asyncHandler(
    async function (req, res, next) {

        const { playlistId, userId, videoId } = req.params;

        // Validate User Id if provided
        if (userId) {
            if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid User ID");

            // set subscriber Id in the req
            req.userId = new mongoose.Types.ObjectId(userId);

            // find the user from DB
            const user = await User.findById(req.userId);

            // throw error if user is not found
            if (!user) {
                throw new ApiError(404, "User Not Found !!");
            }

            // set user in the req
            req.userparams = user;
        }

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

        // move to next 
        next();

    }
)

export default playlistHandler