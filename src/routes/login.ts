import express, { Request, Response } from 'express';
import { TokenAttributes, UserAttributes } from '../types/types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config';
import models from '../models';
import Game from '../models/game';
const loginRouter = express.Router();

loginRouter.post('/', async (req: Request<unknown, unknown, UserAttributes>, res: Response) => {
    const receivedUser = req.body;
    const foundUser = await models.User.findOne({
        where: {
            username: receivedUser.username,
            password: receivedUser.password
        }
    });
    if (foundUser == null) {
        res.status(400).json({ message: 'Wrong credentials' });
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
    res.status(200).json({ token: token });
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