import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    }
})

export async function sendRoomInviteEmail({ to, roomId, startTime, endTime })
{
    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to,

        subject: "Interview Room Invitation",

        html: `
            <h2>Interview Invitation</h2>

            <p>
                You have been invited
                to an interview session.
            </p>

            <p>
                Room ID: ${roomId}
            </p>

            <p>
                Start:
                ${new Date(startTime)}
            </p>

            <p>
                End:
                ${new Date(endTime)}
            </p>
        `
    })
}