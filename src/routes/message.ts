import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import { MessageAttributes } from '../types/types';
import Message from '../models/message';

const messageRouter = express.Router();

messageRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, MessageAttributes>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    const response = await Message.create(req.body);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});
export default messageRouter;