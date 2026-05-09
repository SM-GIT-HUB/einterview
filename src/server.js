import http from "http"

import dotenv from "dotenv"

import { Server } from "socket.io"

import app from "./app.js"

import connectDB from "./config/db.js"

import initializeSocket from "./sockets/socket-server.js"

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})

initializeSocket(io);

connectDB();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})