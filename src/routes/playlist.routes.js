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

/**
 * @swagger
 * /playlist:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Playlist
 *               description:
 *                 type: string
 *                 example: Playlist description
 *     responses:
 *       201:
 *         description: Playlist created successfully
 *       400:
 *         description: Bad request
 */
// Create Playlist
router.route("/").post(validate(playlistValidationSchema), createPlaylist)

/**
 * @swagger
 * /playlist/my-playlists:
 *   get:
 *     summary: Get all playlists for the user
 *     tags: [Playlist]
 *     responses:
 *       200:
 *         description: List of playlists fetched successfully
 */
// Get All Playlists for the User
router.route("/my-playlists").get(getUserPlaylists)

/**
 * @swagger
 * /playlist/{playlistId}:
 *   get:
 *     summary: Get playlist by ID
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist fetched successfully
 *       404:
 *         description: Playlist not found
 */
// Get Playlist by ID
router.route("/:playlistId").get(verifyId, getPlaylistById)

/**
 * @swagger
 * /playlist/{playlistId}:
 *   patch:
 *     summary: Update a playlist
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Playlist
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Playlist not found
 */
// Update Playlist
router.route("/:playlistId").patch(validate(playlistValidationSchema), verifyId, updatePlaylist)

/**
 * @swagger
 * /playlist/add/{videoId}/{playlistId}:
 *   patch:
 *     summary: Add video to playlist
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Video added to playlist successfully
 *       404:
 *         description: Playlist or video not found
 */
// Add video to playlist
router.route("/add/:videoId/:playlistId").patch(verifyId, addVideoToPlaylist)

/**
 * @swagger
 * /playlist/remove/{videoId}/{playlistId}:
 *   patch:
 *     summary: Remove video from playlist
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Video removed from playlist successfully
 *       404:
 *         description: Playlist or video not found
 */
// Remove video from playlist
router.route("/remove/:videoId/:playlistId").patch(verifyId, removeVideoFromPlaylist)

/**
 * @swagger
 * /playlist/{playlistId}:
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
 *       404:
 *         description: Playlist not found
 */
// Delete Playlist
router.route("/:playlistId").delete(verifyId, deletePlaylist)

export default router