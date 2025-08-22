import express, { Request, Response } from 'express';
import { MoveAttributes } from '../types/types';
import Move from '../models/move';
import { tokenExtractor } from '../utils/middleware';
import User from '../models/user';
const moveRouter = express.Router();

moveRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, MoveAttributes>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }
    const move = req.body;
    try {
        const response = await Move.create(move);
        res.json(response);
        return;
    } catch (error) {
        console.log(error);
    }
});


moveRouter.post('/game', tokenExtractor, async (req: Request<unknown, unknown, { gameId: string }>, res: Response) => {
    console.log(req.user, 'Current user');
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
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
    res.json(response);
    return;

});

export default moveRouter;