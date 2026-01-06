"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.togglePublishStatus = exports.updateVideo = exports.getVideoById = exports.uploadVideo = exports.getAllVideos = void 0;
const video_model_1 = require("../models/video.model");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const fileOperation_1 = require("../utils/fileOperation");
// ADD LIKE COUNT IN GET VIDEOS BY ID
const getAllVideos = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Get The search params from the req query
    const { page = 1, limit = 10, query = "", sortBy = "title", sortType = "1" } = req.query;
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
    if (!video_model_1.Video.schema.path(sortBy))
        throw new apiError_1.ApiError(400, "Please provide a valid field name for sorting");
    // create pipelie for getting filtered videos
    const aggregateVideos = video_model_1.Video.aggregate([
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
                [sortBy]: parseInt(sortType),
            },
        },
    ]);
    // Apply pagination to the videos and fetch from database
    const videos = await video_model_1.Video.aggregatePaginate(aggregateVideos, option);
    // Throw error if videos is not found
    if (!videos)
        throw new apiError_1.ApiError(500, "server error");
    // return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, videos, "Videos fetched sucessfully"));
});
exports.getAllVideos = getAllVideos;
// Upload a Video
const uploadVideo = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // Files
    const Files = req.files;
    // Get Video and Thumbnail files local paths
    const videoLocalPath = (_b = (_a = Files === null || Files === void 0 ? void 0 : Files.video) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
    const thumbnailLocalPath = (_d = (_c = Files === null || Files === void 0 ? void 0 : Files.thumbnail) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path;
    // if any one of them is not uploaded throw error
    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new apiError_1.ApiError(400, "Bad Request", [
            !videoLocalPath ? "Video file is required" : "",
            !thumbnailLocalPath ? "Thumbnail file is required" : "",
        ].filter(Boolean));
    }
    // Upload video and thumbnail to coludinary
    const video = await (0, fileOperation_1.uploadOnCloudinary)(videoLocalPath, String((_e = req.user) === null || _e === void 0 ? void 0 : _e._id));
    const thumbnail = await (0, fileOperation_1.uploadOnCloudinary)(thumbnailLocalPath, String((_f = req.user) === null || _f === void 0 ? void 0 : _f._id));
    // Set video url and duration if video is successfully uploaded else throw error
    if (video) {
        req.body.video = video === null || video === void 0 ? void 0 : video.public_id;
        req.body.duration = Math.floor((_g = video === null || video === void 0 ? void 0 : video.duration) !== null && _g !== void 0 ? _g : 0);
    }
    else {
        throw new apiError_1.ApiError(500, "Something went wrong while uploading video !!!");
    }
    // Set thumbnail url if thumbnail is successfully uploaded else throw error
    if (thumbnail) {
        req.body.thumbnail = thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.public_id;
    }
    else {
        throw new apiError_1.ApiError(500, "Something went wrong while uploading Thumbnail !!!");
    }
    // Set User Id as Owner
    req.body.owner = (_h = req.user) === null || _h === void 0 ? void 0 : _h._id;
    // create video in databse
    const createdvideo = await video_model_1.Video.create(req.body);
    // Throw Error if video is not created
    if (!createdvideo)
        throw new apiError_1.ApiError(500, "server error");
    // return response
    return res.status(201).json(new apiResponse_1.ApiResponse(201, createdvideo, "video uploaded sucessfully"));
});
exports.uploadVideo = uploadVideo;
// Get Video by Id
const getVideoById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    // apply aggregation pipeline to fetch the video with the user details
    const updatedvideo = await video_model_1.Video.aggregate([
        {
            $match: {
                _id: (_a = req.video) === null || _a === void 0 ? void 0 : _a._id,
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
    if (!updatedvideo)
        throw new apiError_1.ApiError(404, "Video Not Found");
    // Update View count
    await video_model_1.Video.updateOne({ _id: (_b = req.video) === null || _b === void 0 ? void 0 : _b._id }, { $inc: { views: 1 } });
    // Return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedvideo, "Video Fetched Sucessfully"));
});
exports.getVideoById = getVideoById;
// Update Video
const updateVideo = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // check the ownership
    if (((_b = (_a = req.video) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Video !!!");
    }
    // Thumbnail Local Path
    const thumbnailLocalPath = (_e = req.file) === null || _e === void 0 ? void 0 : _e.path;
    // if video or thumbnail is not uploaded throw error
    if (!thumbnailLocalPath && !req.body.thumbnail) {
        throw new apiError_1.ApiError(400, "Bad Request", ["Thumbnail is required"]);
    }
    // Upload thumbnail to coludinary
    if (thumbnailLocalPath) {
        const thumbnail = await (0, fileOperation_1.uploadOnCloudinary)(thumbnailLocalPath, String((_f = req.user) === null || _f === void 0 ? void 0 : _f._id));
        if (thumbnail) {
            req.body.thumbnail = thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.public_id;
            await (0, fileOperation_1.deleteFromCloudinary)((_h = (_g = req.video) === null || _g === void 0 ? void 0 : _g.thumbnail) !== null && _h !== void 0 ? _h : "");
        }
        else {
            throw new apiError_1.ApiError(500, "Something Went wring while uplaoding image");
        }
    }
    // Update the video
    const updatedvideo = await video_model_1.Video.findByIdAndUpdate((_j = req.video) === null || _j === void 0 ? void 0 : _j._id, req.body, { new: true });
    // Throw error
    if (!updateVideo)
        throw new apiError_1.ApiError(404, "video not found !!");
    // Return Response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedvideo, "Video Updated Sucessfully"));
});
exports.updateVideo = updateVideo;
// Toggle Publish Status
const togglePublishStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
    // check the ownership
    if (((_b = (_a = req.video) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Video !!!");
    }
    // Toggle video Status
    const updatedvideo = await video_model_1.Video.findByIdAndUpdate((_e = req.video) === null || _e === void 0 ? void 0 : _e._id, {
        $set: {
            isPublished: !((_f = req.video) === null || _f === void 0 ? void 0 : _f.isPublished),
        },
    }, { new: true });
    // Throw Error
    if (!updatedvideo)
        throw new apiError_1.ApiError(500, "internal server error !!!");
    // Return Response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedvideo, "Status changed"));
});
exports.togglePublishStatus = togglePublishStatus;
// Delete Video
const deleteVideo = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e;
    // check the ownership
    if (((_b = (_a = req.video) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Video !!!");
    }
    // Delete the video from db
    const deletedvideo = await video_model_1.Video.findByIdAndDelete((_e = req.video) === null || _e === void 0 ? void 0 : _e._id);
    // Throw error if video is not found
    if (!deletedvideo)
        throw new apiError_1.ApiError(404, "video not found !!");
    // return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {}, "Video deleted sucessfully !!"));
});
exports.deleteVideo = deleteVideo;
//# sourceMappingURL=video.controller.js.map