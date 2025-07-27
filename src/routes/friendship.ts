import express, { Request, Response } from 'express';
import { FriendAttributes } from '../types/types';
import models from '../models';

const friendshipRouter = express.Router();

friendshipRouter.post('/', async (req: Request<unknown, unknown, FriendAttributes>, res: Response) => {
    const friendship = req.body;
    const response = await models.FriendShip.create(friendship);
    res.json(response);
    return;
});

export default friendshipRouter;