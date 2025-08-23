import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import GameMessage from '../models/gameMessage';
import { GameMessageAttributes } from '../types/types';

const gameMessageRouter = express.Router();

gameMessageRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, unknown>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const response = await GameMessage.findAll({
        where: {
            gameId: req.params.id
        },
    });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
});


gameMessageRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, GameMessageAttributes>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const newMessage = req.body;
    const response = await GameMessage.create(newMessage);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

export default gameMessageRouter;