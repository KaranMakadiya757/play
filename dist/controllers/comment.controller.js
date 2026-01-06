"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.addComment = exports.getVideoComments = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const comment_model_1 = require("../models/comment.model");
// Get Comment for a video
const getVideoComments = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    // Fetch Page and Limit from request params (coerce to numbers)
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    // Configure Pagination
    const option = {
        page,
        limit,
        customLabels: {
            docs: "comments",
            totalDocs: "totalComments",
        },
    };
    // create aggreagation pipeline for comments
    const aggregatedComments = comment_model_1.Comment.aggregate([
        {
            $match: {
                owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                video: (_b = req.video) === null || _b === void 0 ? void 0 : _b._id,
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes",
            },
        },
        {
            $addFields: {
                likes: { $size: "$likes" },
            },
        },
        {
            $project: {
                _id: 1,
                content: 1,
                likes: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);
    // Apply pagination to the comments and fetch from database
    const comments = await comment_model_1.Comment.aggregatePaginate(aggregatedComments, option);
    // Throw error if comments are not found
    if (!comments)
        throw new apiError_1.ApiError(500, "server error");
    // return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, comments, "Comments fetched sucessfully"));
});
exports.getVideoComments = getVideoComments;
// Add comment
const addComment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b;
    // Set Video id in request body
    req.body.video = (_a = req.video) === null || _a === void 0 ? void 0 : _a._id;
    // Set owner id in request body
    req.body.owner = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    // Create comment
    const createdComment = await comment_model_1.Comment.create(req.body);
    // Throw Error is comment is not created
    if (!createdComment) {
        throw new apiError_1.ApiError(500, "Internal Server Error !!!");
    }
    // Return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, createdComment, "Comment added successfully"));
});
exports.addComment = addComment;
// Update Comment
const updateComment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e;
    // check the ownership
    if (((_b = (_a = req.comment) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Comment !!!");
    }
    // Find the Comment by ID and Update
    const updatedComment = await comment_model_1.Comment.findByIdAndUpdate((_e = req.comment) === null || _e === void 0 ? void 0 : _e._id, req.body, { new: true });
    // Throw error is something goes wrong while updating comment
    if (!updatedComment) {
        throw new apiError_1.ApiError(500, "Internal Server Error !!!");
    }
    // Return Response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedComment, "Comment updated successfully"));
});
exports.updateComment = updateComment;
// Delete Comment
const deleteComment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e;
    // check the ownership
    if (((_b = (_a = req.comment) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Comment !!!");
    }
    // Delete Comment
    const deletedComment = await comment_model_1.Comment.findByIdAndDelete((_e = req.comment) === null || _e === void 0 ? void 0 : _e._id);
    // Throw error is something goes wrong while deleting comment
    if (!deletedComment) {
        throw new apiError_1.ApiError(500, "Internal Server Error !!!");
    }
    // Return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {}, "Comment deleted successfully"));
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=comment.controller.js.map