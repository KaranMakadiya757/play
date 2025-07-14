import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Playlist } from "../models/playlist.model.js"

// Create PLaylist
const createPlaylist = asyncHandler(async (req, res) => {

    // Add User id as owner
    req.body.owner = req.user._id;

    // Create Playlist 
    const playlist = await Playlist.create(req.body);

    // Throw Error
    if (!playlist) throw new ApiError(500, "Something went wrong while creating playlist");

    // Return response
    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));

})

// Get User Playlists
const getUserPlaylists = asyncHandler(async (req, res) => {

    // Fetch the User PLaylists from the DB
    const userplaylist = await Playlist.aggregate([
        {
            $match: {
                owner: req.user._id
            }
        }
    ])

    // Throw Error
    if (!userplaylist) throw new ApiError(500, "Something went wrong while fetching the playlists");

    // Return Response
    return res
        .status(200)
        .json(new ApiResponse(200, userplaylist, "User playlists fetched successfully"))

})

// Get Playlist By ID
const getPlaylistById = asyncHandler(async (req, res) => {

    // Fetch Playlist by merging videos
    const fetchedplaylist = await Playlist.aggregate([
        {
            $match: {
                _id: req.playlist._id
            }
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
                            duration: 1
                        }
                    }
                ]
            }
        }
    ])

    // Throw Error
    if (!fetchedplaylist) throw new ApiError(500, "Internal Server Error")

    // Return the Playlist
    return res
        .status(200)
        .json(new ApiResponse(200, fetchedplaylist, "playlist fetched successfully"))
})

// Update Playlist
const updatePlaylist = asyncHandler(async (req, res) => {

    // Update the Playlist by id
    const updatedplaylist = await Playlist.findByIdAndUpdate(
        req.playlist._id,
        req.body,
        { new: true }
    )

    // Throw Error
    if (!updatedplaylist) throw new ApiError(500, "Something went wrong while creating playlist");

    // Return Response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedplaylist, "Playlist updated successfully"))

})

// Add Video to the Playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {

    // Check if Video already exists in the playlist
    if (req.playlist.videos.includes(req.video._id)) throw new ApiError(400, "Video is already present in the playlist");

    // add video into playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        req.playlist._id,
        {
            $push: { videos: req.video._id }
        },
        { new: true }
    );

    // Throw Error
    if (!updatedPlaylist) throw new ApiError(500, "something went wrong while removing the video");

    // Return response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"));

})

// Remove video From the playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {

    // Check if Video exists in the playlist
    if (!req.playlist.videos.includes(req.video._id)) throw new ApiError(400, "Video you want to remove does not exist in the playlist");

    // remove video from playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        req.playlist._id,
        {
            $pull: { videos: req.video._id }
        },
        { new: true }
    )

    // Throw Error
    if (!updatedPlaylist) throw new ApiError(500, "something went wrong while removing the video")

    // Return Response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"))

})

// Delete PLaylist
const deletePlaylist = asyncHandler(async (req, res) => {

    // FInd the playlist by ID and delete it
    const deletedPlaylist = await Playlist.findByIdAndDelete(req.playlist._id);

    // throw Error
    if (!deletedPlaylist) throw new ApiError(500, "Something went wrong while deleting the playlist");

    // Return Response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted sucessfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}