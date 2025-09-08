import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";

const healthcheck = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, "Servers are running !! Go Ahead :)"));
});

export { healthcheck };
