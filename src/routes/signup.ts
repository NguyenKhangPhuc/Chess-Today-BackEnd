import express, { Request, Response } from "express";

import models from "../models";
import argon2 from 'argon2';
import { UserAttributes } from "../types/user";
import { generateCode, hashToken, sendVerificationEmail } from "../helpers/verification";
import Verification from "../models/verification";
const signUpRouter = express.Router();

// Route to sign up
signUpRouter.post('/', async (req: Request<unknown, unknown, UserAttributes>, res: Response) => {
    // Get the user
    const newUser = req.body;
    if (!newUser) {
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
    // Check the password if it exists
    if (newUser.password && newUser.password.length > 8 && newUser.password.length < 16) {
        // If yes -> hash the password
        newUser.password = await argon2.hash(newUser.password);
    } else {
        // If no -> return error
        res.status(400).json({ error: 'Invalid password, password must be 8-16 words' });
        return;
    }

    const createdUser = await models.User.create(newUser);
    if (createdUser) {
        // Create the random code
        const code = generateCode();
        // Hash the code
        const hashedCode = hashToken(code);
        // Delete old verification code and Create the verification code 
        const verificationCode = { hashToken: hashedCode, userId: createdUser.id, expiredAt: new Date(Date.now() + 5 * 60 * 1000) };
        await Verification.destroy({ where: { userId: createdUser.id } });
        const createdVerificationCode = await Verification.create(verificationCode);
        if (createdVerificationCode) {
            // Send the verification email
            await sendVerificationEmail(createdUser.username, code);
        }
    }
    res.status(200).json({ userId: createdUser.id });
    return;
});

export default signUpRouter;