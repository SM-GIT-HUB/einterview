import cors from "cors"

import express from "express"

import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth-routes.js"
import roomRoutes from "./routes/room-routes.js"

const app = express();

// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true
// }))

app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/room", roomRoutes);

export default app