import express, { Request, Response } from "express";
import Verification from "../models/verification";
import User from "../models/user";
import { generateCode, hashToken, sendVerificationEmail } from "../helpers/verification";
import { VERIFICATION_TYPE } from "../types/enum";

const verificationRouter = express.Router();

// Route to create a verification code and send mail to user
verificationRouter.post('/', async (req: Request<unknown, unknown, { username: string, type: VERIFICATION_TYPE }>, res: Response) => {
    // Find the user, if exists -> create the random 6 number code and send to the user email
    const { username, type } = req.body;
    if (!username || !type) {
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
    const foundUser = await User.findOne({ where: { username: req.body.username } });
    if (!foundUser) {
        res.status(400).json({ error: 'Incorrect Username' });
        return;
    }
    // Generate code
    const code = generateCode();
    const hashCode = hashToken(code);
    let verificationCode;
    if (req.body.type == VERIFICATION_TYPE.AUTHENTICATION) {
        verificationCode = { hashToken: hashCode, userId: foundUser.id, expiredAt: new Date(Date.now() + 60 * 5 * 1000), type: req.body.type };
    } else if (req.body.type == VERIFICATION_TYPE.PASSWORD_RESET) {
        verificationCode = { hashToken: hashCode, userId: foundUser.id, expiredAt: new Date(Date.now() + 60 * 2 * 1000), type: req.body.type };
    } else {
        res.status(400).json({ error: 'Incorrect Type' });
        return;
    }
    // Destroy all previous code of this type
    await Verification.destroy({ where: { userId: foundUser.id, type: req.body.type } });
    // Create the code
    const createdVerificationCode = await Verification.create(verificationCode);
    if (!createdVerificationCode) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    // Send it to user mail
    await sendVerificationEmail(req.body.username, code);
    res.status(200).json({ message: "Code sent to user's mail" });
    return;
});

verificationRouter.post('/verify-code', async (req: Request<unknown, unknown, { code: string, username: string }>, res: Response) => {
    // Find the user and find the verification code based on the userid
    const foundUser = await User.findOne({ where: { username: req.body.username } });
    if (!foundUser) {
        res.status(400).json({ error: 'Incorrect Username' });
        return;
    }
    // Found the verification code, compare the received code with the stored code
    const foundVerificationCode = await Verification.findOne({ where: { userId: foundUser.id, type: VERIFICATION_TYPE.AUTHENTICATION } });
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
    // If match and not expired -> update the verified to be true
    await User.update({ isVerified: true }, { where: { id: foundUser.id } });
    res.status(200).json({ message: 'Verify successfully' });
    return;
});

export default verificationRouter;