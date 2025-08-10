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
    try {
        const response = await FriendShip.findAll({
            where: Object.keys(where).length > 0 ? where : {
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
        const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<FriendAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
        res.json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
        return;
    } catch (error) {
        console.log(error);
    }
});

friendshipRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, FriendAttributes>, res: Response) => {
    try {
        const { friendId } = req.body;
        if (!req.user) {
            res.json({ error: 'Not authenticated' });
            return;
        }

        const response = await models.FriendShip.create({ userId: req.user?.id, friendId });
        res.json(response);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create friendship' });
    }
});

friendshipRouter.delete('/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    console.log('friendship id', req.params.id);
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }
    const response = await models.FriendShip.findByPk(req.params.id);
    if (!response) {
        res.json({ error: 'Friendship not found' });
        return;
    }
    const isCorrectUser = response.userId === req.user.id || response.friendId === req.user.id;
    if (!isCorrectUser) {
        res.json({ error: 'Incorrect user, action not allowed' });
        return;
    }
    await response.destroy();
    res.status(204).end();
});

export default friendshipRouter;