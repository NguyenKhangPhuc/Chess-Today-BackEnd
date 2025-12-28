import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import models from '../models';
import Game from '../models/game';
import { Op } from 'sequelize';
import User from '../models/user';
import { GAME_TYPE, UserAttributes } from '../types/types';
import Move from '../models/move';
import { PaginationCursor } from '../helpers/pagination';
const userRouter = express.Router();
userRouter.get('/check', tokenExtractor, (req: Request, res: Response) => {
    console.log(req.user);
    if (req.user?.id) {
        res.status(200).json({ userInfo: req.user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
    return;
});
userRouter.get('/people', tokenExtractor, async (req: Request, res: Response) => {

    if (!req.user || !req.user.id) {
        res.status(401).json({ error: 'Not authenticated' });
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

    const { limit, after, before } = req.query;
    let where = {};
    if (after) {
        where = {
            [Op.and]: [
                { createdAt: { [Op.lt]: after }, },
                { id: { [Op.notIn]: [...excludeIds, req.user.id] } }
            ]
        };
    }
    if (before) {
        where = {
            [Op.and]: [
                { createdAt: { [Op.gt]: before }, },
                { id: { [Op.notIn]: [...excludeIds, req.user.id] } }
            ]
        };
    }
    const response = await models.User.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            id: { [Op.notIn]: [...excludeIds, req.user.id] }
        },
        limit: Number(limit) + 1,
        attributes: { exclude: ['password'] },
    });
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<UserAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
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
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
            {
                model: models.User,
                as: 'friendOf',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
            {
                model: Game,
                as: 'gameAsPlayer1',
                include: [
                    {
                        model: User,
                        as: 'player1'
                    },
                    {
                        model: User,
                        as: 'player2',
                    },
                    {
                        model: Move,
                        as: 'moveHistory',
                        attributes: ['id']
                    }
                ]
            },
            {
                model: Game,
                as: 'gameAsPlayer2',
                include: [
                    {
                        model: User,
                        as: 'player1'
                    },
                    {
                        model: User,
                        as: 'player2',
                    },
                    {
                        model: Move,
                        as: 'moveHistory',
                        attributes: ['id']
                    }

                ]
            }
        ]
    });
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(response);
});

userRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, unknown>, res: Response) => {
    const response = await models.User.findByPk(req.params?.id, {
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
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
            {
                model: models.User,
                as: 'friendOf',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
            {
                model: Game,
                as: 'gameAsPlayer1',
                include: [
                    {
                        model: User,
                        as: 'player1'
                    },
                    {
                        model: User,
                        as: 'player2',
                    },
                    {
                        model: Move,
                        as: 'moveHistory',
                        attributes: ['id']
                    }
                ]
            },
            {
                model: Game,
                as: 'gameAsPlayer2',
                include: [
                    {
                        model: User,
                        as: 'player1'
                    },
                    {
                        model: User,
                        as: 'player2',
                    },
                    {
                        model: Move,
                        as: 'moveHistory',
                        attributes: ['id']
                    }

                ]
            }
        ]
    });
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(response);
});

userRouter.put('/update-elo', tokenExtractor, async (req: Request<unknown, unknown, { gameType: GAME_TYPE, userElo: number }>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    console.log(req.body);
    const user = await User.findByPk(req.user.id);
    if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
    }
    if (req.body.gameType === GAME_TYPE.ROCKET) {
        const response = await user.update({
            rocketElo: req.body.userElo
        });
        if (!response) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(response);
        return;
    } else if (req.body.gameType === GAME_TYPE.BLITZ) {
        const response = await user.update({
            blitzElo: req.body.userElo
        });
        if (!response) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(response);
        return;
    } else if (req.body.gameType === GAME_TYPE.RAPID) {
        const response = await user.update({
            elo: req.body.userElo
        });
        if (!response) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(response);
        return;
    }
    res.status(400).json({ error: 'Game type incorrect' });
    return;
});


export default userRouter;