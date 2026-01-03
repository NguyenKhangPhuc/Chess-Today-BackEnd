import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, NODE_ENV } from '../utils/config';
import models from '../models';
import argon2 from 'argon2';
import { UserAttributes } from '../types/user';
import { TokenAttributes } from '../types/types';
const loginRouter = express.Router();

// Route to login
loginRouter.post('/', async (req: Request<unknown, unknown, UserAttributes>, res: Response) => {
    // Get the user from the req body
    const receivedUser = req.body;
    // No password -> error
    if (!receivedUser.password) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Find the user with the given username
    const foundUser = await models.User.findOne({
        where: {
            username: receivedUser.username,
        }
    });

    // If there exists no user with that given username -> wrong credentials
    if (foundUser == null) {
        res.status(400).json({ error: 'Wrong credentials' });
        return;
    }
    // If the user has not verified -> return an error 
    if (foundUser.isVerified == false) {
        res.status(400).json({ error: 'Account not verified', errorCode: 'UNVERIFIED' });
        return;
    }
    // Verify the given password and the hash password from the user found
    const valid = await argon2.verify(foundUser.password, receivedUser.password);
    // If it is not valid -> wrong credentials
    if (!valid) {
        res.status(400).json({ error: 'Wrong credentials' });
        return;
    }
    // If it is -> create a token with fields id, username and name.
    const userForToken: TokenAttributes = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
    };
    // Create the token
    const token = jwt.sign(userForToken, JWT_SECRET);
    if (!token) {
        res.status(500).json({ error: 'Token generation failed' });
        return;
    }
    // Store the token to the cookies
    if (NODE_ENV == 'development') {
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',

        });
    } else {
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            domain: '.chesstoday.online',

        });
    }
    console.log(res.getHeaders()['set-cookie']);
    res.status(200).json({ message: 'Login sucessfully' });
    return;
});


export default loginRouter;