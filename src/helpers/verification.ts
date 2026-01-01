import { mailer } from "../infrastructure/mailer";
import crypto from "crypto";
export async function sendVerificationEmail(
    email: string,
    code: string
) {
    await mailer.sendMail({
        from: "nguyenkhangphuc012024@gmail.com",
        to: email,
        subject: "Verify your email, the code will expire in 5 minutes",
        html: `<h2>${code}</h2>`,
    });
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