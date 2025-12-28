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
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
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
                attributes: ['id', 'name', 'username']
            },
            {
                model: User,
                as: 'user2',
                attributes: ['id', 'name', 'username']
            },
            {
                model: Message,
                as: 'messages'
            }
        ]
    });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

chatBoxRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, ChatBoxAttributes>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const [userA, userB] =
        req.body.user1Id < req.body.user2Id
            ? [req.body.user1Id, req.body.user2Id]
            : [req.body.user2Id, req.body.user1Id];
    req.body.userA = userA;
    req.body.userB = userB;
    const response = await ChatBox.create(req.body);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

export default chatBoxRouter;