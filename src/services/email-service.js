import { BrevoClient } from "@getbrevo/brevo"

const client =
    new BrevoClient({
        apiKey:
            process.env.BREVO_API_KEY
    })

export async function sendRoomInviteEmail({
    to,
    roomId,
    startTime,
    endTime
}) {
    try {

        const response =
            await client
            .transactionalEmails
            .sendTransacEmail({

                sender: {
                    name: "E-Interview",
                    email: "examprosys@gmail.com"
                },

                to: [
                    {
                        email: to
                    }
                ],

                subject:
                    "Interview Room Invitation",

                htmlContent: `
                    <h2>
                        Interview Invitation
                    </h2>

                    <p>
                        You have been invited
                        to an interview session.
                    </p>

                    <p>
                        <b>Room ID:</b>
                        ${roomId}
                    </p>

                    <p>
                        <b>Start:</b>
                        ${new Date(startTime).toLocaleString()}
                    </p>

                    <p>
                        <b>End:</b>
                        ${new Date(endTime).toLocaleString()}
                    </p>
                `
            })

        console.log(response);

    }
    catch(err) {

        console.log(err);
    }
}