import express, { Request, Response } from 'express';
import { FriendAttributes } from '../types/types';
import models from '../models';
import { tokenExtractor } from '../utils/middleware';

const friendshipRouter = express.Router();

friendshipRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, FriendAttributes>, res: Response) => {
    try {
        const friendship = req.body;
        console.log(req.user, 'user');
        const response = await models.FriendShip.create(friendship);
        res.json(response);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create friendship' });
    }
});

export default friendshipRouter;