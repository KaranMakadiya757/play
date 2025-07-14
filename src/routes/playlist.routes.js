import { Router } from "express"
import verifyId from "../middlewares/verifyId.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import validate from "../middlewares/validation.middleware.js"
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
router.route("/my-playlists").get(getUserPlaylists)

// Get Playlist by ID
router.route("/:playlistId").get(verifyId, getPlaylistById)

// Update Playlist
router.route("/:playlistId").patch(validate(playlistValidationSchema), verifyId, updatePlaylist)

// Add video to playlist
router.route("/add/:videoId/:playlistId").patch(verifyId, addVideoToPlaylist)

// Remove video from playlist
router.route("/remove/:videoId/:playlistId").patch(verifyId, removeVideoFromPlaylist)

// Delete Playlist
router.route("/:playlistId").delete(verifyId, deletePlaylist)

export default router