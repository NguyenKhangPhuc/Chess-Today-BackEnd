import express, { Request, Response } from 'express';
import { GameAttributes } from '../types/types';
import Game from '../models/game';

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

export default gameRouter;