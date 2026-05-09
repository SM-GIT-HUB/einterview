import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,

    // convert string -> number
    port: Number(process.env.SMTP_PORT),

    // true only for 465
    secure: Number(process.env.SMTP_PORT) === 465,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

export async function sendRoomInviteEmail({
    to,
    roomId,
    startTime,
    endTime
}) {
    try {

        // check smtp connection
        await transporter.verify();

        const info = await transporter.sendMail({

            from: `"Interview Platform" <${process.env.SMTP_USER}>`,

            to,

            subject: "Interview Room Invitation",

            html: `
                <h2>Interview Invitation</h2>

                <p>
                    You have been invited
                    to an interview session.
                </p>

                <p>
                    <b>Room ID:</b> ${roomId}
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
        });

        console.log("EMAIL SENT:", info.messageId);

    } catch (err) {

        console.log("EMAIL ERROR:", err);
    }
}