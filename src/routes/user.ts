import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
const userRouter = express.Router();

userRouter.get('/', tokenExtractor, (req: Request, response: Response) => {
    const user = req.user;
    response.json(user);
});

export default userRouter;