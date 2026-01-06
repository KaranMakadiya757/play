"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyId_middleware_1 = __importDefault(require("../middlewares/verifyId.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const playlist_validator_1 = require("../Validations/playlist.validator");
const playlist_controller_1 = require("../controllers/playlist.controller");
// Router Instance
const router = (0, express_1.Router)();
// Secure Routes
router.use(auth_middleware_1.verifyJWT);
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
router.route("/my-playlists").get(playlist_controller_1.getUserPlaylists);
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
router.route("/:playlistId").get(verifyId_middleware_1.default, playlist_controller_1.getPlaylistById);
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
router.route("/").post((0, validation_middleware_1.default)(playlist_validator_1.playlistValidationSchema), playlist_controller_1.createPlaylist);
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
router.route("/:playlistId").patch((0, validation_middleware_1.default)(playlist_validator_1.playlistValidationSchema), verifyId_middleware_1.default, playlist_controller_1.updatePlaylist);
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
router.route("/add/:videoId/:playlistId").patch(verifyId_middleware_1.default, playlist_controller_1.addVideoToPlaylist);
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
router.route("/remove/:videoId/:playlistId").patch(verifyId_middleware_1.default, playlist_controller_1.removeVideoFromPlaylist);
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
router.route("/:playlistId").delete(verifyId_middleware_1.default, playlist_controller_1.deletePlaylist);
exports.default = router;
//# sourceMappingURL=playlist.routes.js.map