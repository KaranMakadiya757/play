import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/fileUpload.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, userId, sortBy, sortType} = req.query
    //TODO: get all videos based on query, sort, pagination

    console.log(page , limit , query, sortBy, sortType, userId)

    return null
})

const publishAVideo = asyncHandler(async (req, res) => {
    // check title and description
    // check the files 
    // upload the files on cloudinary
    // create a model object
    // retuen response

    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "please Provide title and description")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video and Thumbnail are required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!video || !thumbnail) {
        throw new ApiError(400, "Video and Thumbnail are required")
    }

    const createdvideo = await Video.create({
        title,
        description,
        video: video?.url,
        thumbnail: thumbnail?.url,
        duration: video?.duration,
        owner: req.user._id
    })

    if (!createdvideo) {
        throw new ApiError(500, "server error")
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdvideo, "video uploaded sucessfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    // check for the video id 
    // get the video from db
    // increase the view count
    // return the video

    const { videoId } = req.params

    
    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
    )

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const updatedvideo = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
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
                            fullname: 1,
                            username: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
            }
        },
    ])

    // TODO: FIND A BETTER VWAY TO MERGE THE VIEW UPDATE AND USER LOOKUP IN ONE AGGREGATION PIPELINE

    return res
        .status(200)
        .json(new ApiResponse(200, updatedvideo, "Video Fetched Sucessfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    // check if there are title and description
    // check if thumbnail is there or not
    // upload thumbnail on cloudinary 
    // update video
    // return response

    const { videoId } = req.params
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "title and description are required !!")
    }

    const thumbnailLocalPath = req.file?.path

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Please upload the thumbnail !!")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnail) {
        throw new ApiError(500, "thumbnail upload failed !!")
    }

    const updatedvideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                thumbnail: thumbnail?.url,
                title,
                description,
            }
        },
        { new: true }
    )

    if (!updateVideo) {
        throw new ApiError(404, "video not found !!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video Updated Sucessfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const deletedvideo = await Video.findByIdAndDelete(videoId)

    if (!deleteVideo) {
        throw new ApiError(404, "video not found !!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleteVideo, "Video deleted sucessfully !!"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not found !!")
    }

    const updatedvideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        { new: true }
    )

    if (!updatedvideo) {
        throw new ApiError(500, "internal server error !!!")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedvideo, "Status changed"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}