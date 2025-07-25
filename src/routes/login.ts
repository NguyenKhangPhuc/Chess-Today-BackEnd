import express, { Request, Response } from 'express';
import { TokenAttributes, UserAttributes } from '../types/types';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config';
const loginRouter = express.Router();

loginRouter.post('/', async (req: Request<unknown, unknown, UserAttributes>, res: Response) => {
    const receivedUser = req.body;
    const foundUser = await User.findOne({
        where: {
            username: receivedUser.username,
            password: receivedUser.password
        }
    });
    if (foundUser == null) {
        res.json({ message: 'Wrong credentials' });
        return;
    }

    const userForToken: TokenAttributes = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email,
    };

    const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: token });
    return;
});

export default loginRouter;