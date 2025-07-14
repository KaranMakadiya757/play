import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Comment } from '../models/comment.model.js'

// Get Comment for a video
const getVideoComments = asyncHandler(async (req, res) => {

    // Fetch Page and Limit from request params
    const { page = 1, limit = 10 } = req.query;

    // Configure Pagination
    const option = {
        page,
        limit,
        customLabels: {
            docs: "comments",
            totalDocs: 'totalComments',
        }
    }

    // create aggreagation pipeline for comments
    const aggregatedComments = Comment.aggregate([
        {
            $match: {
                owner: req.user._id,
                video: req.video._id
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    // Apply pagination to the comments and fetch from database
    const comments = await Comment.aggregatePaginate(aggregatedComments, option);

    // Throw error if comments are not found
    if (!comments) throw new ApiError(500, "server error");

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched sucessfully"));

})

// Add comment
const addComment = asyncHandler(async (req, res) => {

    // Set Video id in request body
    req.body.video = req.video._id

    // Set owner id in request body
    req.body.owner = req.user._id

    // Create comment 
    const createdComment = await Comment.create(req.body);

    // Throw Error is comment is not created
    if (!createdComment) {
        throw new ApiError(500, "Internal Server Error !!!");
    }

    // Return response  
    return res
        .status(200)
        .json(new ApiResponse(200, createdComment, "Comment added successfully"));
})

// Update Comment
const updateComment = asyncHandler(async (req, res) => {

    // Find the Comment by ID and Update
    const updatedComment = await Comment.findByIdAndUpdate(
        req.comment._id,
        req.body,
        { new: true }
    );

    // Throw error is something goes wrong while updating comment
    if (!updatedComment) {
        throw new ApiError(500, "Internal Server Error !!!");
    }

    // Return Response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
})

// Delete Comment
const deleteComment = asyncHandler(async (req, res) => {

    // Delete Comment
    const deletedComment = await Comment.findByIdAndDelete(req.comment._id)

    // Throw error is something goes wrong while deleting comment
    if (!deletedComment) {
        throw new ApiError(500, "Internal Server Error !!!");
    }

    // Return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}