import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const subscriptionHandler = asyncHandler(
    async function (req, res, next) {

        const { channelId, subscriberId } = req.params;

        if (channelId) {
            if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid Channel id")

            // set channel Id in the req
            req.channelId = new mongoose.Types.ObjectId(channelId);
        }

        if (subscriberId) {
            if (!isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid Channel id")

            // set subscriber Id in the req
            req.subscriberId = new mongoose.Types.ObjectId(subscriberId);
        }

        // move to next 
        next();

    }
)

export default subscriptionHandler