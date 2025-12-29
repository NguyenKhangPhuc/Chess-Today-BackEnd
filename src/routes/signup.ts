import express, { Request, Response } from "express";
import { UserAttributes } from "../types/types";
import models from "../models";
import argon2 from 'argon2';
const signUpRouter = express.Router();

signUpRouter.post('/', async (req: Request<unknown, unknown, UserAttributes>, res: Response) => {
    const newUser = req.body;
    if (newUser.password) {
        newUser.password = await argon2.hash(newUser.password);
    } else {
        res.status(400).json({ error: 'Internal Server Error' });
        return;
    }
    await models.User.create(newUser);
    res.status(200).json({ message: 'Sign up successfully', newUser });
    return;
});

export default signUpRouter;