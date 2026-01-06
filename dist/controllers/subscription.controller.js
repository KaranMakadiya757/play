"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscribedChannels = exports.getUserChannelSubscribers = exports.toggleSubscription = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const subscription_model_1 = require("../models/subscription.model");
// Toggle Channel Subscription
const toggleSubscription = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    // Create a subscriber object
    const subobj = {
        subscriber: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        channel: (_b = req.channel) === null || _b === void 0 ? void 0 : _b._id,
    };
    // Check Wheather the subscription is added or not
    const subscription = await subscription_model_1.Subscription.findOne(subobj);
    // Toggle the subscription
    if (!subscription) {
        // Add subscription
        const newSubscriber = await subscription_model_1.Subscription.create(subobj);
        // Throw error
        if (!newSubscriber)
            throw new apiError_1.ApiError(500, "Something went wrong while adding subscription");
        // Return response
        return res.status(201).json(new apiResponse_1.ApiResponse(200, {}, "Subscription added"));
    }
    else {
        // remove the subscription
        const removedSubscription = await subscription_model_1.Subscription.deleteOne(subobj);
        // Throw Error
        if (!removedSubscription)
            throw new apiError_1.ApiError(500, "Something went wrong while removing subscription");
        // Return Response
        return res.status(201).json(new apiResponse_1.ApiResponse(200, {}, "Subscription removed"));
    }
});
exports.toggleSubscription = toggleSubscription;
// Get Subscribers List
const getUserChannelSubscribers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // Fetch the subscriber list with user
    const subscriberList = await subscription_model_1.Subscription.aggregate([
        {
            $match: { channel: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id },
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
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                subscriber: { $first: "$subscriber" },
            },
        },
        {
            $project: {
                _id: 1,
                subscriber: 1,
            },
        },
    ]);
    // Throw Error
    if (!subscriberList)
        throw new apiError_1.ApiError(500, "something went wrong while fetching the subscriber list");
    // Return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, subscriberList, "Subscriber list fetched sucessfully"));
});
exports.getUserChannelSubscribers = getUserChannelSubscribers;
// Get Subscribed Channel List
const getSubscribedChannels = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // Fetch the subscribed Channel list with Channel info
    const subscribedChannelList = await subscription_model_1.Subscription.aggregate([
        {
            $match: {
                subscriber: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            },
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
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                channel: { $first: "$channel" },
            },
        },
        {
            $project: {
                _id: 1,
                channel: 1,
            },
        },
    ]);
    // Throw Error
    if (!subscribedChannelList)
        throw new apiError_1.ApiError(500, "something went wrong while fetching the subscribed channel list");
    // Return response
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, subscribedChannelList, "subscribed channel list fetched sucessfully"));
});
exports.getSubscribedChannels = getSubscribedChannels;
//# sourceMappingURL=subscription.controller.js.map