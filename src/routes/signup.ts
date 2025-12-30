import express, { Request, Response } from "express";
import { UserAttributes } from "../types/types";
import models from "../models";
import argon2 from 'argon2';
const signUpRouter = express.Router();

// Route to sign up
signUpRouter.post('/', async (req: Request<unknown, unknown, UserAttributes>, res: Response) => {
    // Get the user
    const newUser = req.body;
    // Check the password if it exists
    if (newUser.password && newUser.password.length > 8 && newUser.password.length < 16) {
        // If yes -> hash the password
        newUser.password = await argon2.hash(newUser.password);
    } else {
        // If no -> return error
        res.status(400).json({ error: 'Invalid password, password must be 8-16 words' });
        return;
    }
    await models.User.create(newUser);
    res.status(200).json({ message: 'Sign up successfully', newUser });
    return;
});

export default signUpRouter;