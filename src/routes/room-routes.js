import express from "express"

import authMiddleware
from "../middleware/auth-middleware.js"

import {
    createRoom,
    getMyRooms,
    getRoom
} from "../controllers/room-controller.js"

const router = express.Router();

router.post(
    "/create",
    authMiddleware,
    createRoom
)

router.get(
    "/my-rooms",
    authMiddleware,
    getMyRooms
)

router.get(
    "/:roomId",
    authMiddleware,
    getRoom
)

export default router