import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"

// EXPRESS APP CREATION 
const app = express()

// USING CORS MIDDLEWARE 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieparser())


// ROUTER IMPORT
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/user", userRouter)

export { app }