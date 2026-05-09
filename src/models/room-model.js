import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({

    roomId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    participantEmail: {
        type: String,
        required: true
    },

    active: {
        type: Boolean,
        default: true
    },

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

}, {
    timestamps: true
})

roomSchema.index({
    creator: 1,
    startTime: 1
})

roomSchema.index({
    participantEmail: 1,
    startTime: 1
})

roomSchema.index({
    endTime: 1
})

const Room = mongoose.model("Room", roomSchema)

export default Room