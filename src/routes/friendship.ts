import express, { Request, Response } from 'express';
import { FriendAttributes } from '../types/types';
import models from '../models';
import { tokenExtractor } from '../utils/middleware';

const friendshipRouter = express.Router();

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