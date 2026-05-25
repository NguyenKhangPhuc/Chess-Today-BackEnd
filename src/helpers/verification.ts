import crypto from "crypto";
import { resend } from "../infrastructure/mailer";
export async function sendVerificationEmail(
    email: string,
    code: string
) {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your email, the code will expire in 5 minutes",
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <p>Your code:</p>
                    <h2 style="color: #3b82f6; font-size: 32px; letter-spacing: 5px;">${code}</h2>
                    <p>Expired in 5 minutes.</p>
                </div>
            `,
        });

        if (error) {
            // Log lỗi để debug trên Render console
            console.error("Resend Error:", error);
            throw new Error(error.message);
        }

        return data;
    } catch (err) {
        console.error("Lỗi hệ thống khi gửi mail:", err);
        throw err;
    }
}
export function generateCode() {
    return crypto.randomInt(100000, 999999).toString();
}

export function hashToken(token: string) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}