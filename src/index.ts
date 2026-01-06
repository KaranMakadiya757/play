import "dotenv/config";
import connectDB from "./db/index";
import { app } from "./app";

const port = Number(process.env.PORT) || 8000;
const dbReady = connectDB();

// Local development: start a normal HTTP server
if (!process.env.VERCEL) {
    dbReady
        .then(() => {
            app.listen(port, () => {
                console.log(`server running on ${port} ✅`);
            });
        })
        .catch((err) => {
            console.error("MongoDB connection error !!! ❌", err);
            process.exit(1);
        });
}

// Vercel: default export is the serverless handler
export default async function handler(req: any, res: any) {
    try {
        await dbReady;
    } catch (err) {
        console.error("MongoDB connection error !!! ❌", err);
        return res.status(500).json({ message: "Database connection failed" });
    }

    return app(req, res);
}
