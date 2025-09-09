import { Router } from "express";
import verifyId from "../middlewares/verifyId.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { playlistValidationSchema } from "../Validations/playlist.validator";

import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller";

// Router Instance
const router = Router();

// Secure Routes
router.use(verifyJWT);

/** Get All Playlists for the User
 *
 * @swagger
 * /playlist/my-playlists:
 *   get:
 *     summary: Get all playlists for the user
 *     tags: [Playlist]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetMyPlaylistsResponse'
 */
router.route("/my-playlists").get(getUserPlaylists);

/** Get Playlist by ID
 *
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
 *         $ref: '#/components/responses/GetPlaylistResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:playlistId").get(verifyId, getPlaylistById);

/** Create Playlist
 *
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
 *             $ref: '#/components/schemas/CreatePlaylistRequest'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreatePlaylistResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.route("/").post(validate(playlistValidationSchema), createPlaylist);

/** Update Playlist
 *
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
 *             $ref: '#/components/schemas/UpdatePlaylistRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UpdatePlaylistResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:playlistId").patch(validate(playlistValidationSchema), verifyId, updatePlaylist);

/** Add video to playlist
 *
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
 *         $ref: '#/components/responses/AddVideoToPlaylistResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/add/:videoId/:playlistId").patch(verifyId, addVideoToPlaylist);

/** Remove video from playlist
 *
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
 *         $ref: '#/components/responses/RemoveVideoFromPlaylistResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/remove/:videoId/:playlistId").patch(verifyId, removeVideoFromPlaylist);

/** Delete Playlist
 *
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
 *         $ref: '#/components/responses/DeletePlaylistResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.route("/:playlistId").delete(verifyId, deletePlaylist);

export default router;
