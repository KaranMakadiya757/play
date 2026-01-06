"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthcheck = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const healthcheck = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    return res.status(200).json(new apiResponse_1.ApiResponse(200, "Servers are running !! Go Ahead :)"));
});
exports.healthcheck = healthcheck;
//# sourceMappingURL=healthcheck.controller.js.map