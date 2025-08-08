import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import ChatBox from '../models/chatbox';
import { Op } from 'sequelize';
import { ChatBoxAttributes } from '../types/types';
import User from '../models/user';
import Message from '../models/message';
const chatBoxRouter = express.Router();

chatBoxRouter.get('/', tokenExtractor, async (req: Request, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }
    try {
        const response = await ChatBox.findAll({
            where: {
                [Op.or]: [
                    { user1Id: req.user.id },
                    { user2Id: req.user.id }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Message,
                    as: 'messages'
                }
            ]
        });
        res.json(response);
    } catch (error) {
        console.log(error);
    }
    return;
});

chatBoxRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, ChatBoxAttributes>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }
    const response = await ChatBox.create(req.body);
    res.json(response);
    return;
});

export default chatBoxRouter;