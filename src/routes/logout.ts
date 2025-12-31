import express, { Request, Response } from 'express';
import { UserAttributes } from '../types/user';
import { tokenExtractor } from '../utils/middleware';
const logoutRouter = express.Router();

// Route to logout
logoutRouter.post('/', tokenExtractor, (_: Request<unknown, unknown, UserAttributes>, res: Response) => {
    // Remove the token from the cookies
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