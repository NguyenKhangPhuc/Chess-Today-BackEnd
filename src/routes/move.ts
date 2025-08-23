import express, { Request, Response } from 'express';
import { MoveAttributes } from '../types/types';
import Move from '../models/move';
import { tokenExtractor } from '../utils/middleware';
import User from '../models/user';
const moveRouter = express.Router();

moveRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, MoveAttributes>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const move = req.body;
    const response = await Move.create(move);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});


moveRouter.post('/game', tokenExtractor, async (req: Request<unknown, unknown, { gameId: string }>, res: Response) => {
    console.log(req.user, 'Current user');
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const response = await Move.findAll({
        where: {
            gameId: req.body.gameId
        },
        include: [
            {
                model: User,
                as: 'mover',
                attributes: { exclude: ['password'] }
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

export default moveRouter;