import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import Message from '../models/message';
import { MessageAttributes } from '../types/message';

const messageRouter = express.Router();

// Route to create the message with other users
messageRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, MessageAttributes>, res: Response) => {
    if (!req.body) {
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
    // Check if the people who create the message must be either sender or receiver
    if (req.user!.id != req.body.senderId && req.user!.id != req.body.receiverId) {
        res.status(401).json({ error: 'You are not allowed to do this' });
    }

    // Create the message
    const response = await Message.create(req.body);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

export default messageRouter;