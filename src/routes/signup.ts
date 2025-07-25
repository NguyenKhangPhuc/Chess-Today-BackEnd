import express, { Request, Response } from "express";
import { UserAttributes } from "../types/types";
import User from "../models/user";
const signUpRouter = express.Router();

signUpRouter.post('/', async (req: Request<unknown, unknown, UserAttributes>, res: Response) => {
    const newUser = req.body;
    try {
        await User.create(newUser);
        res.json({ message: 'Sign up successfully', newUser });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }

});

export default signUpRouter;