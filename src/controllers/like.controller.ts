import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Like } from "../models/like.model";

const getLikedVideos = asyncHandler(async (req, res) => {
    // Get liked videos
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: req.user?._id,
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        avatar: 1,
                                        username: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                video: { $first: "$video" },
            },
        },
        {
            $project: {
                video: 1,
            },
        },
    ]);

    // Throw Error is we get error while fetching liked videos
    if (!likedVideos) {
        throw new ApiError(500, "Internal Server Error !!!");
    }

    // Return respone
    return res.status(200).json(new ApiResponse(200, likedVideos, "Videos Fetched SuccessFully"));
});

const toggleVideoLike = asyncHandler(async (req, res) => {
    // Create a Like object
    const likeobj = {
        likedBy: req.user?._id,
        video: req.video?._id,
    };

    // Check Wheather the like is added or not
    const like = await Like.findOne(likeobj);

    // Toggle the like
    if (!like) {
        // Add Like
        const newLike = await Like.create(likeobj);

        // Throw error
        if (!newLike) throw new ApiError(500, "Something went wrong while adding like");

        // Return response
        return res.status(201).json(new ApiResponse(200, {}, "Added like to video"));
    } else {
        // remove the subscription
        const removedLike = await Like.deleteOne(likeobj);

        // Throw Error
        if (!removedLike) throw new ApiError(500, "Something went wrong while removing like");

        // Return Response
        return res.status(201).json(new ApiResponse(200, {}, "Like removed from video"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    // Create a Like object
    const likeobj = {
        likedBy: req.user?._id,
        comment: req.comment?._id,
    };

    // Check Wheather the like is added or not
    const like = await Like.findOne(likeobj);

    // Toggle the like
    if (!like) {
        // Add Like
        const newLike = await Like.create(likeobj);

        // Throw error
        if (!newLike) throw new ApiError(500, "Something went wrong while adding like");

        // Return response
        return res.status(201).json(new ApiResponse(200, {}, "Added like to comment"));
    } else {
        // remove the subscription
        const removedLike = await Like.deleteOne(likeobj);

        // Throw Error
        if (!removedLike) throw new ApiError(500, "Something went wrong while removing like");

        // Return Response
        return res.status(201).json(new ApiResponse(200, {}, "Like removed from comment"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    // Create a Like object
    const likeobj = {
        likedBy: req.user?._id,
        tweet: req.tweet?._id,
    };

    // Check Wheather the like is added or not
    const like = await Like.findOne(likeobj);

    // Toggle the like
    if (!like) {
        // Add Like
        const newLike = await Like.create(likeobj);

        // Throw error
        if (!newLike) throw new ApiError(500, "Something went wrong while adding like");

        // Return response
        return res.status(201).json(new ApiResponse(200, {}, "Added like to tweet"));
    } else {
        // remove the subscription
        const removedLike = await Like.deleteOne(likeobj);

        // Throw Error
        if (!removedLike) throw new ApiError(500, "Something went wrong while removing like");

        // Return Response
        return res.status(201).json(new ApiResponse(200, {}, "Like removed from tweet"));
    }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
