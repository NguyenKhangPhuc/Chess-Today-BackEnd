import express, { Request, Response } from 'express';
import { UserAttributes } from '../types/user';
import { tokenExtractor } from '../utils/middleware';
import { NODE_ENV } from '../utils/config';
const logoutRouter = express.Router();

// Route to logout
logoutRouter.post('/', tokenExtractor, (_: Request<unknown, unknown, UserAttributes>, res: Response) => {
    // Remove the token from the cookies
    if (NODE_ENV == 'development') {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
    } else {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            domain: '.chesstoday.online',
        });
    }
    res.status(200).json({ message: 'Logged out' });
    return;
});

export default logoutRouter;