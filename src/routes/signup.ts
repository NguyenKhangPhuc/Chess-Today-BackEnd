import express, { Request, Response } from "express";
import { UserAttributes } from "../types/types";
import models from "../models";

const signUpRouter = express.Router();

signUpRouter.post('/', async (req: Request<unknown, unknown, UserAttributes>, res: Response) => {
    const newUser = req.body;
    await models.User.create(newUser);
    res.status(200).json({ message: 'Sign up successfully', newUser });
    return;
});

export default signUpRouter;