"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelVideos = exports.getChannelStats = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const getChannelStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});
exports.getChannelStats = getChannelStats;
const getChannelVideos = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
});
exports.getChannelVideos = getChannelVideos;
//# sourceMappingURL=dashboard.controller.js.map