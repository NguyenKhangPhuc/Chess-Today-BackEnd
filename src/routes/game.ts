import express, { Request, Response } from 'express';
import { GameAttributes } from '../types/types';
import Game from '../models/game';
import Move from '../models/move';

const gameRouter = express.Router();

gameRouter.post('/', async (req: Request<unknown, unknown, GameAttributes>, res: Response) => {
    const game = req.body;
    try {
        const response = await Game.create(game);
        res.json(response);
    } catch (err) {
        console.log(err);
    }
});

gameRouter.get('/', async (_: Request, res: Response) => {
    const response = await Game.findAll({
        include: [
            {
                model: Move,
                as: 'moveHistory'
            }
        ]
    });
    res.json(response);
    return;
});


gameRouter.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    const response = await Game.findByPk(req.params.id, {
        include: [
            {
                model: Move,
                as: 'moveHistory'
            }
        ]
    });
    res.json(response);
    return;
});

export default gameRouter;