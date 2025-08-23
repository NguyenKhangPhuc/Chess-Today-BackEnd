import express, { Request, Response } from 'express';
import { FriendAttributes } from '../types/types';
import models from '../models';
import { tokenExtractor } from '../utils/middleware';
import { Op } from 'sequelize';
import FriendShip from '../models/friendship';
import User from '../models/user';
import { PaginationCursor } from '../helpers/pagination';

const friendshipRouter = express.Router();

friendshipRouter.get('/user/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    const { after, before, limit } = req.query;
    console.log(req.query);
    console.log(limit, 'LIMIT');
    console.log(req.params.id);
    let where = {};
    if (after) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { userId: req.params.id },
                        { friendId: req.params.id },
                    ]
                },
                { createdAt: { [Op.lt]: after } }

            ]
        };
    }
    if (before) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { userId: req.params.id },
                        { friendId: req.params.id },
                    ]
                },
                { createdAt: { [Op.gt]: before } }

            ]
        };
    }
    const response = await FriendShip.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            [Op.or]: [
                { userId: req.params?.id },
                { friendId: req.params?.id },
            ]
        },
        order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
        limit: Number(limit) + 1,
        include: [
            {
                model: User,
                as: 'user',
                attributes: { exclude: ['password'] }
            },
            {
                model: User,
                as: 'friend',
                attributes: { exclude: ['password'] }
            }
        ]
    });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<FriendAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
});

friendshipRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, FriendAttributes>, res: Response) => {
    const { friendId } = req.body;
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    const response = await models.FriendShip.create({ userId: req.user?.id, friendId });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

friendshipRouter.delete('/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    console.log('friendship id', req.params.id);
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const response = await models.FriendShip.findByPk(req.params.id);
    if (!response) {
        res.status(401).json({ error: 'Friendship not found' });
        return;
    }
    const isCorrectUser = response.userId === req.user.id || response.friendId === req.user.id;
    if (!isCorrectUser) {
        res.status(403).json({ error: 'Incorrect user, action not allowed' });
        return;
    }
    await response.destroy();
    res.status(204).end();
    return;
});

export default friendshipRouter;