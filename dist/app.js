"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorhandler_middleware_1 = __importDefault(require("./middlewares/errorhandler.middleware"));
const swagger_1 = require("./swagger");
// EXPRESS APP CREATION
const app = (0, express_1.default)();
// USING CORS MIDDLEWARE
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ limit: "16kb", extended: true }));
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
// Swagger Docs
app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
// ROUTER IMPORT
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const healthcheck_routes_1 = __importDefault(require("./routes/healthcheck.routes"));
const tweet_routes_1 = __importDefault(require("./routes/tweet.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const videos_routes_1 = __importDefault(require("./routes/videos.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const like_routes_1 = __importDefault(require("./routes/like.routes"));
const playlist_routes_1 = __importDefault(require("./routes/playlist.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
app.use("/api/v1/user", user_routes_1.default);
app.use("/api/v1/healthcheck", healthcheck_routes_1.default);
app.use("/api/v1/tweets", tweet_routes_1.default);
app.use("/api/v1/subscriptions", subscription_routes_1.default);
app.use("/api/v1/videos", videos_routes_1.default);
app.use("/api/v1/comments", comment_routes_1.default);
app.use("/api/v1/likes", like_routes_1.default);
app.use("/api/v1/playlist", playlist_routes_1.default);
app.use("/api/v1/dashboard", dashboard_routes_1.default);
app.use(errorhandler_middleware_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map