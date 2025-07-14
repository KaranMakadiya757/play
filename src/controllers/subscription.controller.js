import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Subscription } from "../models/subscription.model.js"

// Toggle Channel Subscription
const toggleSubscription = asyncHandler(async (req, res) => {

    // Create a subscriber object
    const subobj = {
        subscriber: req.user._id,
        channel: req.channelId
    }

    // Check Wheather the subscription is added or not
    const subscription = await Subscription.findOne(subobj);

    // Toggle the subscription
    if (!subscription) {
        // Add subscription
        const newSubscriber = await Subscription.create(subobj);

        // Throw error 
        if (!newSubscriber) throw new ApiError(500, "Something went wrong while adding subscription");

        // Return response
        return res
            .status(201)
            .json(new ApiResponse(200, {}, "Subscription added"))

    } else {
        // remove the subscription
        const removedSubscription = await Subscription.deleteOne(subobj);

        // Throw Error
        if (!removedSubscription) throw new ApiError(500, "Something went wrong while removing subscription");

        // Return Response
        return res
            .status(201)
            .json(new ApiResponse(200, {}, "Subscription removed"));
    }

})

// Get Subscribers List
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    // Fetch the subscriber list with user 
    const subscriberList = await Subscription.aggregate([
        {
            $match: { channel: req.user._id }
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
        },
        {
            $addFields: {
                subscriber: { $first: "$subscriber" },
            }
        },
        {
            $project: {
                _id: 1,
                subscriber: 1
            }
        }
    ])

    // Throw Error
    if (!subscriberList) throw new ApiError(500, "something went wrong while fetching the subscriber list")

    // Return response
    return res
        .status(200)
        .json(new ApiResponse(200, subscriberList, "Subscriber list fetched sucessfully"))

})

// Get Subscribed Channel List
const getSubscribedChannels = asyncHandler(async (req, res) => {

    // Fetch the subscribed Channel list with Channel info
    const subscribedChannelList = await Subscription.aggregate([
        {
            $match: {
                subscriber: req.user._id
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
        },
        {
            $addFields: {
                channel: { $first: "$channel" },
            }
        },
        {
            $project: {
                _id: 1,
                channel: 1
            }
        }
    ]);

    // Throw Error
    if (!subscribedChannelList) throw new ApiError(500, "something went wrong while fetching the subscribed channel list");

    // Return response
    return res
        .status(200)
        .json(new ApiResponse(200, subscribedChannelList, "subscribed channel list fetched sucessfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}