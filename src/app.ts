import cors from "cors";
import express from "express";
import cookieparser from "cookie-parser";
import errorHandler from "./middlewares/errorhandler.middleware";
import { swaggerUi, swaggerSpec } from "./swagger";

// EXPRESS APP CREATION
const app = express();

// USING CORS MIDDLEWARE
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieparser());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTER IMPORT
import userRouter from "./routes/user.routes";
import healthcheckRouter from "./routes/healthcheck.routes";
import tweetRouter from "./routes/tweet.routes";
import subscriptionRouter from "./routes/subscription.routes";
import videoRouter from "./routes/videos.routes";
import commentRouter from "./routes/comment.routes";
import likeRouter from "./routes/like.routes";
import playlistRouter from "./routes/playlist.routes";
import dashboardRouter from "./routes/dashboard.routes";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(errorHandler);

export default app;
