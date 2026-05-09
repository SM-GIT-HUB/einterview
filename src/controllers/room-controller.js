import { v4 as uuidv4 } from "uuid"

import Room from "../models/room-model.js"

import { sendRoomInviteEmail } from "../services/email-service.js"

export async function createRoom(req, res)
{
    try {

        const {
            name,
            participantEmail,
            startTime,
            endTime
        } = req.body;

        if (
            !name ||
            !participantEmail ||
            !startTime ||
            !endTime
        )
        {
            return res.status(400).json({
                message: "All fields required"
            })
        }

        const start =
            new Date(startTime + ":00").getTime();

        const end =
            new Date(endTime + ":00").getTime();

        const now = Date.now();

        if (start >= end)
        {
            return res.status(400).json({
                message:
                    "End time must be after start time"
            })
        }

        if (end <= now)
        {
            return res.status(400).json({
                message:
                    "End time must be future time"
            })
        }

        const room =
            await Room.create({

                roomId: uuidv4(),
                name,

                creator: req.user._id,

                participantEmail,

                startTime,

                endTime
            })

        //
        // fire and forget email
        //
        sendRoomInviteEmail({
            to: participantEmail,
            roomId: room.roomId,
            startTime,
            endTime
        }).catch(console.log)

        return res.status(201).json({
            message: "Room created",
            data: room
        })
    }
    catch(err) {

        return res.status(500).json({
            message: err.message
        })
    }
}

export async function getMyRooms(req, res)
{
    try {

        const type = req.query.type;

        const now = new Date();

        let timeFilter = {};

        if (type === "upcoming")
        {
            timeFilter = {
                endTime: {
                    $gte: now
                }
            }
        }

        if (type === "past")
        {
            timeFilter = {
                endTime: {
                    $lt: now
                }
            }
        }

        const rooms =
            await Room.find({

                ...timeFilter,

                $or: [
                    {
                        creator:
                            req.user._id
                    },
                    {
                        participantEmail:
                            req.user.email
                    }
                ]
            })
            .populate(
                "creator",
                "email"
            )
            .sort({
                startTime: 1
            })

        return res.status(200).json({
            data: rooms
        })
    }
    catch(err) {

        return res.status(500).json({
            message: err.message
        })
    }
}

export async function getRoom(req, res)
{
    try {

        const room =
            await Room.findOne({
                roomId: req.params.roomId
            })
            .populate(
                "creator",
                "email"
            )

        if (!room)
        {
            return res.status(404).json({
                message: "Room not found"
            })
        }

        const isCreator =
            room.creator._id.toString()
            === req.user._id.toString();

        const isParticipant =
            room.participantEmail
            === req.user.email;

        if (
            !isCreator &&
            !isParticipant
        )
        {
            return res.status(403).json({
                message: "Access denied"
            })
        }

        const now = Date.now();

        if (
            now >
            new Date(room.endTime).getTime()
        )
        {
            room.active = false;

            await room.save();

            return res.status(400).json({
                message: "Room expired"
            })
        }

        return res.status(200).json({
            data: room
        })
    }
    catch(err) {

        return res.status(500).json({
            message: err.message
        })
    }
}