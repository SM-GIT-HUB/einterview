function initializeSocket(io)
{
    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        //
        // JOIN ROOM
        //
        socket.on("join-room", (roomId) => {

            const room =
                io.sockets.adapter.rooms.get(roomId);

            const numberOfClients =
                room ? room.size : 0;

            socket.join(roomId);

            console.log(
                `Socket ${socket.id} joined ${roomId}`
            )

            //
            // Tell the already-connected peer
            // that someone joined.
            //
            if (numberOfClients > 0)
            {
                socket.to(roomId).emit("peer-joined");
            }
        })

        //
        // CODE CHANGES
        //
        socket.on(
            "code-change",
            ({ roomId, code }) => {

                socket.to(roomId)
                .emit(
                    "code-update",
                    code
                )
            }
        )

        //
        // WEBRTC OFFER
        //
        socket.on(
            "offer",
            ({ roomId, offer }) => {

                socket.to(roomId)
                .emit(
                    "receive-offer",
                    offer
                )
            }
        )

        //
        // WEBRTC ANSWER
        //
        socket.on(
            "answer",
            ({ roomId, answer }) => {

                socket.to(roomId)
                .emit(
                    "receive-answer",
                    answer
                )
            }
        )

        //
        // ICE CANDIDATES
        //
        socket.on(
            "ice-candidate",
            ({ roomId, candidate }) => {

                socket.to(roomId)
                .emit(
                    "receive-ice-candidate",
                    candidate
                )
            }
        )

        socket.on("disconnect", () => {
            console.log(
                "User disconnected:",
                socket.id
            )
        })
    })
}

export default initializeSocket