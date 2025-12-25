import express, { Request, Response } from 'express';
import { UserAttributes } from '../types/types';
const logoutRouter = express.Router();

logoutRouter.post('/', (_: Request<unknown, unknown, UserAttributes>, res: Response) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    });
    res.status(200).json({ message: 'Logged out' });
    return;
});

export default logoutRouter;