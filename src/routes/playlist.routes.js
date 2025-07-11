import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import validate from "../middlewares/validation.middleware.js"
import playlistHandler from "../middlewares/playlist.middleware.js"
import { playlistValidationSchema } from "../Validations/playlist.validator.js"

import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js"

// Router Instance
const router = Router()

// Secure Routes
router.use(verifyJWT)

// Create Playlist
router.route("/").post(validate(playlistValidationSchema), createPlaylist)

// Get All Playlists for the User
router.route("/user/:userId").get(playlistHandler, getUserPlaylists)

// Get Playlist by ID
router.route("/:playlistId").get(playlistHandler, getPlaylistById)

// Update Playlist
router.route("/:playlistId").patch(validate(playlistValidationSchema), playlistHandler, updatePlaylist)

// Add video to playlist
router.route("/add/:videoId/:playlistId").patch(playlistHandler, addVideoToPlaylist)

// Remove video from playlist
router.route("/remove/:videoId/:playlistId").patch(playlistHandler, removeVideoFromPlaylist)

// Delete Playlist
router.route("/:playlistId").delete(playlistHandler, deletePlaylist)

export default router