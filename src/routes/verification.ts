import express, { Request, Response } from "express";
import Verification from "../models/verification";
import User from "../models/user";
import { generateCode, hashToken, sendVerificationEmail } from "../helpers/verification";

const verificationRouter = express.Router();

verificationRouter.post('/', async (req: Request<unknown, unknown, { username: string }>, res: Response) => {
    const foundUser = await User.findOne({ where: { username: req.body.username } });
    if (!foundUser) {
        res.status(400).json({ error: 'Incorrect Username' });
        return;
    }
    const code = generateCode();
    const hashCode = hashToken(code);
    const verificationCode = { hashToken: hashCode, userId: foundUser.id, expiredAt: new Date(Date.now() + 60 * 5 * 1000) };
    await Verification.destroy({ where: { userId: foundUser.id } });
    const createdVerificationCode = await Verification.create(verificationCode);
    if (!createdVerificationCode) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    await sendVerificationEmail(req.body.username, code);
    res.status(200).json({ message: "Code sent to user's mail" });
    return;
});

verificationRouter.post('/verify-code', async (req: Request<unknown, unknown, { code: string, username: string }>, res: Response) => {
    const foundUser = await User.findOne({ where: { username: req.body.username } });
    if (!foundUser) {
        res.status(400).json({ error: 'Incorrect Username' });
        return;
    }
    const foundVerificationCode = await Verification.findOne({ where: { userId: foundUser.id } });
    if (!foundVerificationCode) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }

    if (hashToken(req.body.code) != foundVerificationCode.hashToken) {
        res.status(401).json({ error: 'Invalid code' });
        return;
    }

    if (foundVerificationCode.expiredAt < new Date()) {
        res.status(401).json({ error: 'Expired code' });
        return;
    }
    await User.update({ isVerified: true }, { where: { id: foundUser.id } });
    res.status(200).json({ message: 'Verify successfully' });
    return;
});

export default verificationRouter;