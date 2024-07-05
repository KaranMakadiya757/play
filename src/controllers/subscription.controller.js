import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Subscription } from "../models/subscription.model.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    // validate the object id
    // find the channel and toggle subscription
    // throw error if channel not found 
    // return respone

    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID")
    }

    const subobj = {
        subscriber: req.user._id,
        channel: channelId
    }

    const subscription = await Subscription.findOne(subobj)

    if (!subscription) {
        const newSubscriber = await Subscription.create(subobj)

        if (!newSubscriber) {
            throw new ApiError(500, "Something went wrong while adding subscription")
        }

        return res
            .status(201)
            .json(new ApiResponse(200, {}, "Subscription added"))

    }
    else {
        const removedSubscription = await Subscription.deleteOne(subobj)

        if (!removedSubscription) {
            throw new ApiError(500, "Something went wrong while removing subscription")
        }

        return res
            .status(201)
            .json(new ApiResponse(200, {}, "Subscription removed"))
    }

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID")
    }

    const subscriberList = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ])

    if (!subscriberList) {
        throw new ApiError(500, "something went wrong while fetching the subscriber list")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subscriberList, "Subscriber list fetched sucessfully"))

})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid Subscriber ID")
    }

    const subscribedChannelList = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ])

    if (!subscribedChannelList) {
        throw new ApiError(500, "something went wrong while fetching the subscribed channel list")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subscribedChannelList, "subscribed channel list fetched sucessfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}