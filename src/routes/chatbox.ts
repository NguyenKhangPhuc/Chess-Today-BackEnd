import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import ChatBox from '../models/chatbox';
import { Op } from 'sequelize';
import User from '../models/user';
import Message from '../models/message';
import { ChatBoxAttributes } from '../types/chatbox';
const chatBoxRouter = express.Router();

// Route to get all the chatbox of the verified user
chatBoxRouter.get('/', tokenExtractor, async (req: Request, res: Response) => {

    // Find all the chatbox where the userId is either user1Id or user2Id, using join query on User and Message table.
    const response = await ChatBox.findAll({
        where: {
            [Op.or]: [
                { user1Id: req.user!.id },
                { user2Id: req.user!.id }
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
    // If the response is null -> error
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

// Route to create a chatbox
chatBoxRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, ChatBoxAttributes>, res: Response) => {
    if (!req.body) {
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
    // userA and userB are the indexes of the chatbox tables, normalize them before create
    // so that we can avoid duplicate chatbox of the same user.
    const [userA, userB] =
        req.body.user1Id < req.body.user2Id
            ? [req.body.user1Id, req.body.user2Id]
            : [req.body.user2Id, req.body.user1Id];
    // Store the value to the body object and create the chatbox
    req.body.userA = userA;
    req.body.userB = userB;
    const response = await ChatBox.create(req.body);
    // If the response is null -> error
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

export default chatBoxRouter;