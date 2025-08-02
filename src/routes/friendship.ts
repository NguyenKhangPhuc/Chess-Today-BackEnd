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

export default friendshipRouter;