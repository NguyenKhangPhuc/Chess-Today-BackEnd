import express, { Request, Response } from 'express';
import models from '../models';
import { tokenExtractor } from '../utils/middleware';
import { Op } from 'sequelize';
import FriendShip from '../models/friendship';
import User from '../models/user';
import { PaginationCursor } from '../helpers/pagination';
import { FriendAttributes } from '../types/friend';

const friendshipRouter = express.Router();

// Get the relationship of the verified user.
friendshipRouter.get('/user/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Invalid id' });
    }
    // Get the query params from the front-end including cursor after - before and limit to take
    const { after, before, limit } = req.query;
    let where = {};
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is either userId or friendId
    // Besides, the value of there created_at field must be less than after cursor (older than the cursor)
    if (after) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { userId: id },
                        { friendId: id },
                    ]
                },
                { createdAt: { [Op.lt]: after } }

            ]
        };
    }
    // If there exitst before cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is either userId or friendId
    // Besides, the value of there created_at field must be greater than after cursor (newer than the cursor)
    if (before) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { userId: id },
                        { friendId: id },
                    ]
                },
                { createdAt: { [Op.gt]: before } }

            ]
        };
    }

    // Find all the relations with the where condition above
    // If there exists no after and before cursor -> get data if userId = userId or userId = friendId
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
    const response = await FriendShip.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            [Op.or]: [
                { userId: id },
                { friendId: id },
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
    console.log(response);
    // Get the new next/prev cursor and the boolean value which show if there exists next/prev page.
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<FriendAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
});

// Route to create friendship relation with other person
friendshipRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, FriendAttributes>, res: Response) => {
    if (req.body) {
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
    // Get the id from the other person from request body
    const { friendId } = req.body;
    // Create the friendship
    const response = await models.FriendShip.create({ userId: req.user!.id, friendId });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});


// Route to delete the friendship relation with other person
friendshipRouter.delete('/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }
    // Find the friendship by its id from the request params
    const response = await models.FriendShip.findByPk(id);
    if (!response) {
        res.status(401).json({ error: 'Friendship not found' });
        return;
    }
    // Check if the person who delete this friendship is permitted to do it.
    const isCorrectUser = response.userId === req.user!.id || response.friendId === req.user!.id;
    if (!isCorrectUser) {
        res.status(403).json({ error: 'Incorrect user, action not allowed' });
        return;
    }
    await response.destroy();
    res.status(204).end();
    return;
});

export default friendshipRouter;