import "dotenv/config";
import connectDB from "./db/index";
import app from "./app";

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server running on ${process.env.PORT} ✅`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error !!! ❌", err);
    });
