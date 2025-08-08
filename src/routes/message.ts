import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import { MessageAttributes } from '../types/types';
import Message from '../models/message';

const messageRouter = express.Router();

messageRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, MessageAttributes>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }

    const response = await Message.create(req.body);
    res.json(response);
    return;
});
export default messageRouter;