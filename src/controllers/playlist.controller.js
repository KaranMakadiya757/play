import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Playlist } from "../models/playlist.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) throw new ApiError(400, "Name and description both are required")

    const playlist = await Playlist.create({
        name,
        description,
        owner: new mongoose.Types.ObjectId(req.user._id)
    })

    if (!playlist) throw new ApiError(500, "Something went wrong while creating playlist")

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) throw new ApiError(400, "user ID invalid")

    const userplaylist = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        }
    ])

    if (!userplaylist) throw new ApiError(500, "Something went wrong while fetching the playlists")

    return res
        .status(200)
        .json(new ApiResponse(200, userplaylist, "User playlists fetched successfully"))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "playlist ID invalid")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist fetched successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "playlist ID invalid")

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlist)
    if (!deletedPlaylist) throw new ApiError(500, "Something went wrong while deleting the playlist")

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted sucessfully"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "please provide valid playlist ID")
    if (!isValidObjectId(videoId)) throw new ApiError(400, "please provide valid video ID")

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) throw new ApiError(404, "Playlist not found")

    if (playlist.videos.includes(videoId)) throw new ApiError(400, "Video is alredy present in the playlist")

    playlist.videos.push(videoId)
    await playlist.save()

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video added to playlist successfully"))

})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "please provide valid playlist ID")
    if (!isValidObjectId(videoId)) throw new ApiError(400, "please provide valid video ID")

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) throw new ApiError(404, "Playlist not found")

    if (!playlist.videos.includes(videoId)) throw new ApiError(400, "Video you want to remove does not exist in the playlist")


    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist,
        {
            $pull: { videos: videoId }
        },
        { new: true }
    )

    if (!updatedPlaylist) throw new ApiError(500, "something went wrong while removing the video")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"))

})


const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid Playlist ID")
    if (!name) throw new ApiError(400, "Please provide a name for the playlist")
    if (!description) throw new ApiError(400, "Please provide a description for the playlist")

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) throw new ApiError(404, "Playlist not found")

    playlist.name = name
    playlist.description = description

    await playlist.save()

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist updated successfully"))

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