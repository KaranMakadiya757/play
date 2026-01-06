"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlaylist = exports.deletePlaylist = exports.removeVideoFromPlaylist = exports.addVideoToPlaylist = exports.getPlaylistById = exports.getUserPlaylists = exports.createPlaylist = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const playlist_model_1 = require("../models/playlist.model");
// Create PLaylist
const createPlaylist = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // Add User id as owner
    req.body.owner = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    // Create Playlist
    const playlist = await playlist_model_1.Playlist.create(req.body);
    // Throw Error
    if (!playlist)
        throw new apiError_1.ApiError(500, "Something went wrong while creating playlist");
    // Return response
    return res.status(201).json(new apiResponse_1.ApiResponse(201, playlist, "Playlist created successfully"));
});
exports.createPlaylist = createPlaylist;
// Get User Playlists
const getUserPlaylists = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    // Fetch the User PLaylists from the DB
    const userplaylist = await playlist_model_1.Playlist.aggregate([
        {
            $match: {
                owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            },
        },
    ]);
    // Throw Error
    if (!userplaylist)
        throw new apiError_1.ApiError(500, "Something went wrong while fetching the playlists");
    // Return Response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, userplaylist, "User playlists fetched successfully"));
});
exports.getUserPlaylists = getUserPlaylists;
// Get Playlist By ID
const getPlaylistById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e;
    // check the ownership
    if (((_b = (_a = req.playlist) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Resource !!!");
    }
    // Fetch Playlist by merging videos
    const fetchedplaylist = await playlist_model_1.Playlist.aggregate([
        {
            $match: {
                _id: (_e = req.playlist) === null || _e === void 0 ? void 0 : _e._id,
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            thumbnail: 1,
                            duration: 1,
                        },
                    },
                ],
            },
        },
    ]);
    // Throw Error
    if (!fetchedplaylist)
        throw new apiError_1.ApiError(500, "Internal Server Error");
    // Return the Playlist
    return res.status(200).json(new apiResponse_1.ApiResponse(200, fetchedplaylist, "playlist fetched successfully"));
});
exports.getPlaylistById = getPlaylistById;
// Update Playlist
const updatePlaylist = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e;
    // check the ownership
    if (((_b = (_a = req.playlist) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Resource !!!");
    }
    // Update the Playlist by id
    const updatedplaylist = await playlist_model_1.Playlist.findByIdAndUpdate((_e = req.playlist) === null || _e === void 0 ? void 0 : _e._id, req.body, { new: true });
    // Throw Error
    if (!updatedplaylist)
        throw new apiError_1.ApiError(500, "Something went wrong while creating playlist");
    // Return Response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedplaylist, "Playlist updated successfully"));
});
exports.updatePlaylist = updatePlaylist;
// Add Video to the Playlist
const addVideoToPlaylist = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // check the ownership
    if (((_b = (_a = req.playlist) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Resource !!!");
    }
    // Check if Video already exists in the playlist
    if ((_e = req.playlist) === null || _e === void 0 ? void 0 : _e.videos.includes((_f = req.video) === null || _f === void 0 ? void 0 : _f._id))
        throw new apiError_1.ApiError(400, "Video is already present in the playlist");
    // add video into playlist
    const updatedPlaylist = await playlist_model_1.Playlist.findByIdAndUpdate((_g = req.playlist) === null || _g === void 0 ? void 0 : _g._id, {
        $push: { videos: (_h = req.video) === null || _h === void 0 ? void 0 : _h._id },
    }, { new: true });
    // Throw Error
    if (!updatedPlaylist)
        throw new apiError_1.ApiError(500, "something went wrong while removing the video");
    // Return response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"));
});
exports.addVideoToPlaylist = addVideoToPlaylist;
// Remove video From the playlist
const removeVideoFromPlaylist = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // check the ownership
    if (((_b = (_a = req.playlist) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Resource !!!");
    }
    // Check if Video exists in the playlist
    if (!((_e = req.playlist) === null || _e === void 0 ? void 0 : _e.videos.includes((_f = req.video) === null || _f === void 0 ? void 0 : _f._id)))
        throw new apiError_1.ApiError(400, "Video you want to remove does not exist in the playlist");
    // remove video from playlist
    const updatedPlaylist = await playlist_model_1.Playlist.findByIdAndUpdate((_g = req.playlist) === null || _g === void 0 ? void 0 : _g._id, {
        $pull: { videos: (_h = req.video) === null || _h === void 0 ? void 0 : _h._id },
    }, { new: true });
    // Throw Error
    if (!updatedPlaylist)
        throw new apiError_1.ApiError(500, "something went wrong while removing the video");
    // Return Response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"));
});
exports.removeVideoFromPlaylist = removeVideoFromPlaylist;
// Delete PLaylist
const deletePlaylist = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a, _b, _c, _d, _e;
    // check the ownership
    if (((_b = (_a = req.playlist) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.toString()) !== ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString())) {
        throw new apiError_1.ApiError(403, "You Don't have access to this Resource !!!");
    }
    // FInd the playlist by ID and delete it
    const deletedPlaylist = await playlist_model_1.Playlist.findByIdAndDelete((_e = req.playlist) === null || _e === void 0 ? void 0 : _e._id);
    // throw Error
    if (!deletedPlaylist)
        throw new apiError_1.ApiError(500, "Something went wrong while deleting the playlist");
    // Return Response
    return res.status(200).json(new apiResponse_1.ApiResponse(200, {}, "Playlist deleted sucessfully"));
});
exports.deletePlaylist = deletePlaylist;
//# sourceMappingURL=playlist.controller.js.map