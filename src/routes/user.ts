import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import models from '../models';
import Game from '../models/game';
import { Op } from 'sequelize';
const userRouter = express.Router();

userRouter.get('/people', tokenExtractor, async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
        res.json({ error: 'Not authenticated' });
        return;
    }

    const userFriends = await models.FriendShip.findAll({
        where: {
            [Op.or]: [
                { userId: req.user.id },
                { friendId: req.user.id }
            ]
        }
    });

    const excludeIds: Array<string> = userFriends.flatMap((e) => {
        if (e.userId === req.user?.id) return [e.friendId];
        else if (e.friendId === req.user?.id) return [e.userId];
        return [];
    });

    const response = await models.User.findAll({
        where: {
            id: { [Op.notIn]: [...excludeIds, req.user.id] }
        },
        attributes: { exclude: ['password'] },
    });
    res.json(response);
});

userRouter.get('/', tokenExtractor, async (req: Request, res: Response) => {
    const response = await models.User.findByPk(req.user?.id, {
        attributes: { exclude: ['password'] },
        include: [
            {
                model: models.Invitation,
                as: 'sentInvitations',
                include: [
                    {
                        model: models.User,
                        as: 'receiver',
                        attributes: { exclude: ['password'] }
                    }
                ]
            },
            {
                model: models.Invitation,
                as: 'receivedInvitations',
                include: [
                    {
                        model: models.User,
                        as: 'sender',
                        attributes: { exclude: ['password'] }
                    }
                ]
            },
            {
                model: models.User,
                as: 'friends',
                through: {
                    attributes: []
                },
                attributes: { exclude: ['password'] }
            },
            {
                model: models.User,
                as: 'friendOf',
                through: {
                    attributes: []
                },
                attributes: { exclude: ['password'] }
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
    res.json(response);
});

export default userRouter;