"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = exports.errorResponse = exports.successResponse = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
// src/utils/swaggerUtils.ts
/**
 * Utility to build a standard response schema
 * @param message Example success message
 * @param statusCode Example status code
 * @param data Schema reference or object
 */
const successResponse = (message, statusCode, data = null) => ({
    type: "object",
    properties: {
        success: { type: "boolean", example: true },
        statusCode: { type: "integer", example: statusCode },
        message: { type: "string", example: message },
        data: data !== null && data !== void 0 ? data : { type: "object", nullable: true },
    },
});
exports.successResponse = successResponse;
/**
 * Utility to build an error response schema
 * @param message Example error message
 * @param statusCode Example status code
 */
const errorResponse = (message, statusCode) => ({
    type: "object",
    properties: {
        success: { type: "boolean", example: false },
        statusCode: { type: "integer", example: statusCode },
        message: { type: "string", example: message },
        errors: {
            type: "array",
            items: { type: "string" },
            example: ["Error descriptions"],
        },
    },
});
exports.errorResponse = errorResponse;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Play Tube API",
            version: "1.0.0",
            description: "A You Tube Clone API for video streaming platform with Swagger docs",
        },
        servers: [
            {
                url: process.env.API_URL,
                description: "Version 1.0.0",
            },
        ],
        tags: [
            { name: "Health Check" },
            { name: "Auth" },
            { name: "User" },
            { name: "Video" },
            { name: "Comment" },
            { name: "Like" },
            { name: "Subscription" },
            { name: "Playlist" },
            { name: "Tweet" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            responses: {
                ValidationError: {
                    description: "Validation error",
                    content: {
                        "application/json": {
                            schema: (0, exports.errorResponse)("Missing required fields", 400),
                        },
                    },
                },
                UnauthorizedError: {
                    description: "Unauthorized request",
                    content: {
                        "application/json": {
                            schema: (0, exports.errorResponse)("Unauthorized request", 401),
                        },
                    },
                },
                ForbiddenError: {
                    description: "Forbidden",
                    content: {
                        "application/json": {
                            schema: (0, exports.errorResponse)("Forbidden", 403),
                        },
                    },
                },
                NotFoundError: {
                    description: "Resource not found",
                    content: {
                        "application/json": {
                            schema: (0, exports.errorResponse)("Resource not found", 404),
                        },
                    },
                },
                ConflictError: {
                    description: "Conflict",
                    content: {
                        "application/json": {
                            schema: (0, exports.errorResponse)("Conflict", 409),
                        },
                    },
                },
                ServerError: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: (0, exports.errorResponse)("Internal server error", 500),
                        },
                    },
                },
                // Success responses
                RegisterResponse: {
                    description: "User registered successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("User registered successfully", 201, {
                                type: "object",
                                properties: { user: { $ref: "#/components/schemas/User" }, token: { type: "string" } },
                            })
                        }
                    },
                },
                LoginResponse: {
                    description: "User logged in successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("User logged in successfully", 200, {
                                type: "object",
                                properties: { user: { $ref: "#/components/schemas/User" }, accessToken: { type: "string" }, refreshToken: { type: "string" } },
                            })
                        }
                    },
                },
                SendOtpResponse: {
                    description: "OTP sent successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("OTP sent successfully", 200, { type: "object" }) } },
                },
                VerifyOtpResponse: {
                    description: "OTP verified successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("OTP verified successfully", 200, {
                                type: "object",
                                properties: { user: { $ref: "#/components/schemas/User" }, accessToken: { type: "string" }, refreshToken: { type: "string" } },
                            })
                        }
                    },
                },
                RefreshTokenResponse: {
                    description: "Token refreshed successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Token refreshed successfully", 200, {
                                type: "object",
                                properties: { accessToken: { type: "string" }, refreshToken: { type: "string" } },
                            })
                        }
                    },
                },
                GetCurrentUserResponse: {
                    description: "User fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("User fetched successfully", 200, { $ref: "#/components/schemas/User" })
                        }
                    },
                },
                UpdateAccountDetailsResponse: {
                    description: "Account details updated successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Account details updated successfully", 200, { $ref: "#/components/schemas/User" })
                        }
                    },
                },
                ChangePasswordResponse: {
                    description: "Password changed successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Password changed successfully", 200, { type: "object" }) } },
                },
                LogoutResponse: {
                    description: "Logged out successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Logged out successfully", 200, { type: "object" }) } },
                },
                DeleteUserResponse: {
                    description: "User deleted successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("User deleted successfully", 200, { type: "object" }) } },
                },
                GetChannelProfileResponse: {
                    description: "Channel information fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Channel information fetched successfully", 200, { $ref: "#/components/schemas/User" })
                        }
                    },
                },
                GetWatchHistoryResponse: {
                    description: "Watch history fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("List of videos fetched successfully", 200, { type: "array", items: { $ref: "#/components/schemas/Video" } })
                        }
                    },
                },
                GetVideosResponse: {
                    description: "List of videos fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("List of videos fetched successfully", 200, { type: "array", items: { $ref: "#/components/schemas/Video" } })
                        }
                    },
                },
                GetVideoResponse: {
                    description: "Video fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Video fetched successfully", 200, { $ref: "#/components/schemas/Video" })
                        }
                    },
                },
                UploadVideoResponse: {
                    description: "Video uploaded successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Video uploaded successfully", 201, { $ref: "#/components/schemas/Video" })
                        }
                    },
                },
                UpdateVideoResponse: {
                    description: "Video updated successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Video updated successfully", 200, { $ref: "#/components/schemas/Video" })
                        }
                    },
                },
                TogglePublishResponse: {
                    description: "Video publish status toggled successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Video publish status toggled successfully", 200, { type: "object" }) } },
                },
                DeleteVideoResponse: {
                    description: "Video deleted successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Video deleted successfully", 200, { type: "object" }) } },
                },
                GetVideoCommentsResponse: {
                    description: "List of comments fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("List of comments fetched successfully", 200, { type: "array", items: { $ref: "#/components/schemas/Comment" } })
                        }
                    },
                },
                AddCommentResponse: {
                    description: "Comment added successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Comment added successfully", 201, { $ref: "#/components/schemas/Comment" })
                        }
                    },
                },
                UpdateCommentResponse: {
                    description: "Comment updated successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Comment updated successfully", 200, { $ref: "#/components/schemas/Comment" })
                        }
                    },
                },
                DeleteCommentResponse: {
                    description: "Comment deleted successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Comment deleted successfully", 200, { type: "object" }) } },
                },
                GetLikedVideosResponse: {
                    description: "List of liked videos fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("List of liked videos fetched successfully", 200, { type: "array", items: { $ref: "#/components/schemas/Video" } })
                        }
                    },
                },
                ToggleVideoLikeResponse: {
                    description: "Like toggled successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Like toggled successfully", 200, { type: "object" }) } },
                },
                ToggleCommentLikeResponse: {
                    description: "Like toggled successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Like toggled successfully", 200, { type: "object" }) } },
                },
                ToggleTweetLikeResponse: {
                    description: "Like toggled successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Like toggled successfully", 200, { type: "object" }) } },
                },
                GetSubscribersResponse: {
                    description: "List of subscribers fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("List of subscribers fetched successfully", 200, { type: "array", items: { $ref: "#/components/schemas/User" } })
                        }
                    },
                },
                GetSubscriptionsResponse: {
                    description: "List of subscriptions fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("List of subscriptions fetched successfully", 200, { type: "array", items: { $ref: "#/components/schemas/User" } })
                        }
                    },
                },
                ToggleSubscriptionResponse: {
                    description: "Subscription toggled successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Subscription toggled successfully", 200, { type: "object" }) } },
                },
                GetMyPlaylistsResponse: {
                    description: "List of playlists fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("List of playlists fetched successfully", 200, { type: "array", items: { $ref: "#/components/schemas/Playlist" } })
                        }
                    },
                },
                GetPlaylistResponse: {
                    description: "Playlist fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Playlist fetched successfully", 200, { $ref: "#/components/schemas/Playlist" })
                        }
                    },
                },
                CreatePlaylistResponse: {
                    description: "Playlist created successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Playlist created successfully", 201, { $ref: "#/components/schemas/Playlist" })
                        }
                    },
                },
                UpdatePlaylistResponse: {
                    description: "Playlist updated successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Playlist updated successfully", 200, { $ref: "#/components/schemas/Playlist" })
                        }
                    },
                },
                AddVideoToPlaylistResponse: {
                    description: "Video added to playlist successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Video added to playlist successfully", 200, { type: "object" }) } },
                },
                RemoveVideoFromPlaylistResponse: {
                    description: "Video removed from playlist successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Video removed from playlist successfully", 200, { type: "object" }) } },
                },
                DeletePlaylistResponse: {
                    description: "Playlist deleted successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Playlist deleted successfully", 200, { type: "object" }) } },
                },
                GetMyTweetsResponse: {
                    description: "List of tweets fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("List of tweets fetched successfully", 200, { type: "array", items: { $ref: "#/components/schemas/Tweet" } })
                        }
                    },
                },
                CreateTweetResponse: {
                    description: "Tweet created successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Tweet created successfully", 201, { $ref: "#/components/schemas/Tweet" })
                        }
                    },
                },
                UpdateTweetResponse: {
                    description: "Tweet updated successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Tweet updated successfully", 200, { $ref: "#/components/schemas/Tweet" })
                        }
                    },
                },
                DeleteTweetResponse: {
                    description: "Tweet deleted successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Tweet deleted successfully", 200, { type: "object" }) } },
                },
                GetChannelStatsResponse: {
                    description: "Channel statistics fetched successfully",
                    content: { "application/json": { schema: (0, exports.successResponse)("Channel statistics fetched successfully", 200, { type: "object" }) } },
                },
                GetChannelVideosResponse: {
                    description: "Channel videos fetched successfully",
                    content: {
                        "application/json": {
                            schema: (0, exports.successResponse)("Channel videos fetched successfully", 200, { type: "array", items: { $ref: "#/components/schemas/Video" } })
                        }
                    },
                },
                HealthcheckResponse: {
                    description: "Servers Are running",
                    content: { "application/json": { schema: (0, exports.successResponse)("Servers Are running", 200, { type: "object" }) } },
                },
            },
            schemas: {
                // Core entities (minimal fields to keep docs concise)
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "65f1b4e..." },
                        username: { type: "string", example: "karan123" },
                        email: { type: "string", format: "email", example: "karan@example.com" },
                        fullname: { type: "string", example: "Karan Makadiya" },
                        avatar: { type: "string", example: "user/Profile/ajksjoojvpkpvpskf" },
                        coverimage: { type: "string", example: "user/Profile/ajksjoojvpkpvpskf" },
                        watchhistory: { type: "array", items: [] },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Video: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "65f1b4e..." },
                        video: { type: "string", example: "user/5w4fww49s4ss/ajksjoojvpkpvpskf" },
                        thumbnail: { type: "string", example: "user/5w4fww49s4ss/ajksjoojvpkpvpskf" },
                        title: { type: "string", example: "Video Title" },
                        description: { type: "string", example: "Video Description" },
                        duration: { type: "number", example: 1234 },
                        views: { type: "number", example: 1234 },
                        isPublished: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Comment: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "65f1b4e..." },
                        content: { type: "string", example: "Comment Content" },
                        video: { type: "string", example: "65f1b4e..." },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Tweet: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "65f1b4e..." },
                        content: { type: "string", example: "Tweet Content" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Playlist: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "65f1b4e..." },
                        name: { type: "string", example: "Playlist Name" },
                        description: { type: "string", example: "Playlist Description" },
                        videos: { type: "array", items: [] },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                // Requests
                RegisterRequest: {
                    type: "object",
                    required: ["username", "email", "fullname", "password"],
                    properties: {
                        username: { type: "string", example: "karan123" },
                        email: { type: "string", format: "email", example: "karan@example.com" },
                        fullname: { type: "string", example: "Karan Makadiya" },
                        password: { type: "string", format: "password", example: "Pass@123" },
                        avatar: { type: "string", format: "binary" },
                        coverimage: { type: "string", format: "binary" },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string", format: "password" },
                    },
                },
                SendOtpRequest: {
                    type: "object",
                    required: ["email"],
                    properties: { email: { type: "string", format: "email" } },
                },
                VerifyOtpRequest: {
                    type: "object",
                    required: ["email", "otp"],
                    properties: { email: { type: "string", format: "email" }, otp: { type: "string" } },
                },
                UpdateAccountDetailsRequest: {
                    type: "object",
                    properties: {
                        username: { type: "string" },
                        email: { type: "string", format: "email" },
                        fullname: { type: "string" },
                        avatar: { type: "string", format: "binary" },
                        coverimage: { type: "string", format: "binary" },
                    },
                },
                ChangePasswordRequest: {
                    type: "object",
                    required: ["oldPassword", "newPassword"],
                    properties: { oldPassword: { type: "string" }, newPassword: { type: "string" } },
                },
                UploadVideoRequest: {
                    type: "object",
                    required: ["video", "thumbnail", "title"],
                    properties: {
                        video: { type: "string", format: "binary" },
                        thumbnail: { type: "string", format: "binary" },
                        title: { type: "string" },
                        description: { type: "string" },
                        isPublished: { type: "boolean" },
                    },
                },
                UpdateVideoRequest: {
                    type: "object",
                    properties: {
                        thumbnail: { type: "string", format: "binary" },
                        title: { type: "string" },
                        description: { type: "string" },
                        isPublished: { type: "boolean" },
                    },
                },
                AddCommentRequest: {
                    type: "object",
                    required: ["content"],
                    properties: { content: { type: "string" } },
                },
                UpdateCommentRequest: {
                    type: "object",
                    required: ["content"],
                    properties: { content: { type: "string" } },
                },
                CreateTweetRequest: {
                    type: "object",
                    required: ["content"],
                    properties: { content: { type: "string" } },
                },
                UpdateTweetRequest: {
                    type: "object",
                    required: ["content"],
                    properties: { content: { type: "string" } },
                },
                CreatePlaylistRequest: {
                    type: "object",
                    required: ["name"],
                    properties: { name: { type: "string" }, description: { type: "string" } },
                },
                UpdatePlaylistRequest: {
                    type: "object",
                    properties: { name: { type: "string" }, description: { type: "string" } },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
//# sourceMappingURL=swagger.js.map