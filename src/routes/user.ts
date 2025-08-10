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
    try {
        const response = await models.User.findAll({
            where: Object.keys(where).length > 0 ? where : {
                id: { [Op.notIn]: [...excludeIds, req.user.id] }
            },
            limit: Number(limit) + 1,
            attributes: { exclude: ['password'] },
        });

        const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<UserAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
        res.json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
        return;
    } catch (error) {
        console.log(error);
    }
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
    res.json(response);
});

userRouter.put('/update-elo', tokenExtractor, async (req: Request<unknown, unknown, { gameType: GAME_TYPE, userElo: number }>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }
    console.log(req.body);
    const user = await User.findByPk(req.user.id);
    if (!user) {
        res.json({ error: 'User not found' });
        return;
    }
    try {
        if (req.body.gameType === GAME_TYPE.ROCKET) {
            const response = await user.update({
                rocketElo: req.body.userElo
            });
            res.json(response);
            return;
        } else if (req.body.gameType === GAME_TYPE.BLITZ) {
            const response = await user.update({
                blitzElo: req.body.userElo
            });
            res.json(response);
            return;
        } else if (req.body.gameType === GAME_TYPE.RAPID) {
            const response = await user.update({
                elo: req.body.userElo
            });
            res.json(response);
            return;
        }
        res.json({ error: 'game type incorrect' });
        return;
    } catch (error) {
        console.log('This is the error', error);
    }
});


export default userRouter;