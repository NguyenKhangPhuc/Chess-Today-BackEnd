import express, { Request, Response } from 'express';
import { TokenAttributes, UserAttributes } from '../types/types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config';
import models from '../models';
import Game from '../models/game';
import argon2 from 'argon2';
const loginRouter = express.Router();

loginRouter.post('/', async (req: Request<unknown, unknown, UserAttributes>, res: Response) => {
    const receivedUser = req.body;
    if (!receivedUser.password) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    const foundUser = await models.User.findOne({
        where: {
            username: receivedUser.username,
        }
    });


    if (foundUser == null) {
        res.status(400).json({ error: 'Wrong credentials' });
        return;
    }


    const valid = await argon2.verify(foundUser.password, receivedUser.password);

    if (!valid) {
        res.status(400).json({ error: 'Wrong credentials' });
        return;
    }

    const userForToken: TokenAttributes = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
    };
    console.log('Signining in secret', JWT_SECRET);
    const token = jwt.sign(userForToken, JWT_SECRET);
    if (!token) {
        res.status(500).json({ error: 'Token generation failed' });
        return;
    }
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',

    });
    console.log('Cookie set on response headers:', res.getHeader('Set-Cookie'));
    res.status(200).json({ message: 'Login sucessfully' });
    return;
});


loginRouter.get('/', async (_: Request, res: Response) => {
    const response = await models.User.findAll({
        include: [
            {
                model: models.Invitation,
                as: 'sentInvitations'
            },
            {
                model: models.Invitation,
                as: 'receivedInvitations'
            },
            {
                model: models.User,
                as: 'friends',
                through: {
                    attributes: []
                }
            },
            {
                model: models.User,
                as: 'friendOf',
                through: {
                    attributes: []
                }
            },
            {
                model: Game,
                as: 'gameAsPlayer1'
            },
            {
                model: Game,
                as: 'gameAsPlayer2'
            }
        ]
    });
    if (!response) {
        res.status(500).json({ error: 'Internal Server error' });
        return;
    }
    res.status(200).json(response);
});

export default loginRouter;