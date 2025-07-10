import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const videoHandler = asyncHandler(
    async function (req, res, next) {
        // get the video id from params
        const { videoId } = req.params;

        if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video id")

        // find the video from DB
        const video = await Video.findById(new mongoose.Types.ObjectId(videoId));

        // throw error if video is not found
        if (!video) {
            throw new ApiError(404, "video Not Found !!");
        }

        // check the ownership
        if (video.owner?.toString() !== req.user._id?.toString()) {
            throw new ApiError(403, "You Don't have access to this Resource !!!");
        }

        // set video in the req
        req.video = video;

        // move to next 
        next();

    }
)

export default videoHandler