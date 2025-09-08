import { Video } from "../models/video.model";
import { SearchParams } from "../types/video.types";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/fileOperation";

// ADD LIKE COUNT IN GET VIDEOS BY ID
const getAllVideos = asyncHandler(async (req, res) => {
    // Get The search params from the req query
    const { page = 1, limit = 10, query = "", sortBy = "title", sortType = "1" } = req.query as SearchParams;

    // Configure Pagination
    const option = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        customLabels: {
            docs: "videos",
            totalDocs: "totalVideos",
        },
    };

    // Throw error if sorting field is not a valid field
    if (!Video.schema.path(sortBy)) throw new ApiError(400, "Please provide a valid field name for sorting");

    // create pipelie for getting filtered videos
    const aggregateVideos = Video.aggregate([
        {
            $match: {
                isPublished: true,
                title: { $regex: query, $options: "i" },
            },
        },
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
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                likes: { $size: "$likes" },
            },
        },
        {
            $sort: {
                [sortBy]: parseInt(sortType) as 1 | -1,
            },
        },
    ]);

    // Apply pagination to the videos and fetch from database
    const videos = await Video.aggregatePaginate(aggregateVideos, option);

    // Throw error if videos is not found
    if (!videos) throw new ApiError(500, "server error");

    // return response
    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched sucessfully"));
});

// Upload a Video
const uploadVideo = asyncHandler(async (req, res) => {
    // Files
    const Files = req.files as {
        video?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
    };

    // Get Video and Thumbnail files local paths
    const videoLocalPath = Files?.video?.[0]?.path;
    const thumbnailLocalPath = Files?.thumbnail?.[0]?.path;

    // if any one of them is not uploaded throw error
    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(
            400,
            "Bad Request",
            [
                !videoLocalPath ? "Video file is required" : "",
                !thumbnailLocalPath ? "Thumbnail file is required" : "",
            ].filter(Boolean)
        );
    }

    // Upload video and thumbnail to coludinary
    const video = await uploadOnCloudinary(videoLocalPath, String(req.user?._id));
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, String(req.user?._id));

    // Set video url and duration if video is successfully uploaded else throw error
    if (video) {
        req.body.video = video?.public_id;
        req.body.duration = Math.floor(video?.duration ?? 0);
    } else {
        throw new ApiError(500, "Something went wrong while uploading video !!!");
    }

    // Set thumbnail url if thumbnail is successfully uploaded else throw error
    if (thumbnail) {
        req.body.thumbnail = thumbnail?.public_id;
    } else {
        throw new ApiError(500, "Something went wrong while uploading Thumbnail !!!");
    }

    // Set User Id as Owner
    req.body.owner = req.user?._id;

    // create video in databse
    const createdvideo = await Video.create(req.body);

    // Throw Error if video is not created
    if (!createdvideo) throw new ApiError(500, "server error");

    // return response
    return res.status(201).json(new ApiResponse(201, createdvideo, "video uploaded sucessfully"));
});

// Get Video by Id
const getVideoById = asyncHandler(async (req, res) => {
    // apply aggregation pipeline to fetch the video with the user details
    const updatedvideo = await Video.aggregate([
        {
            $match: {
                _id: req.video?._id,
            },
        },
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
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                likes: { $size: "$likes" },
            },
        },
    ]);

    if (!updatedvideo) throw new ApiError(404, "Video Not Found");

    // Update View count
    await Video.updateOne({ _id: req.video?._id }, { $inc: { views: 1 } });

    // Return response
    return res.status(200).json(new ApiResponse(200, updatedvideo, "Video Fetched Sucessfully"));
});

// Update Video
const updateVideo = asyncHandler(async (req, res) => {
    // check the ownership
    if (req.video?.owner?.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "You Don't have access to this Video !!!");
    }

    // Thumbnail Local Path
    const thumbnailLocalPath = req.file?.path;

    // if video or thumbnail is not uploaded throw error
    if (!thumbnailLocalPath && !req.body.thumbnail) {
        throw new ApiError(400, "Bad Request", ["Thumbnail is required"]);
    }

    // Upload thumbnail to coludinary
    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, String(req.user?._id));

        if (thumbnail) {
            req.body.thumbnail = thumbnail?.public_id;
            await deleteFromCloudinary(req.video?.thumbnail ?? "");
        } else {
            throw new ApiError(500, "Something Went wring while uplaoding image");
        }
    }

    // Update the video
    const updatedvideo = await Video.findByIdAndUpdate(req.video?._id, req.body, { new: true });

    // Throw error
    if (!updateVideo) throw new ApiError(404, "video not found !!");

    // Return Response
    return res.status(200).json(new ApiResponse(200, updatedvideo, "Video Updated Sucessfully"));
});

// Toggle Publish Status
const togglePublishStatus = asyncHandler(async (req, res) => {
    // check the ownership
    if (req.video?.owner?.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "You Don't have access to this Video !!!");
    }

    // Toggle video Status
    const updatedvideo = await Video.findByIdAndUpdate(
        req.video?._id,
        {
            $set: {
                isPublished: !req.video?.isPublished,
            },
        },
        { new: true }
    );

    // Throw Error
    if (!updatedvideo) throw new ApiError(500, "internal server error !!!");

    // Return Response
    return res.status(200).json(new ApiResponse(200, updatedvideo, "Status changed"));
});

// Delete Video
const deleteVideo = asyncHandler(async (req, res) => {
    // check the ownership
    if (req.video?.owner?.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "You Don't have access to this Video !!!");
    }

    // Delete the video from db
    const deletedvideo = await Video.findByIdAndDelete(req.video?._id);

    // Throw error if video is not found
    if (!deletedvideo) throw new ApiError(404, "video not found !!");

    // return response
    return res.status(200).json(new ApiResponse(200, {}, "Video deleted sucessfully !!"));
});

export { getAllVideos, uploadVideo, getVideoById, updateVideo, togglePublishStatus, deleteVideo };
