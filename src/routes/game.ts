import express, { Request, Response } from 'express';
import { GameAttributes } from '../types/types';
import Game from '../models/game';
import Move from '../models/move';
import models from '../models';
import { tokenExtractor } from '../utils/middleware';

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
            },
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
            },
            {
                model: models.User,
                as: 'player1',
                attributes: { exclude: ['password'] }
            },
            {
                model: models.User,
                as: 'player2',
                attributes: { exclude: ['password'] }
            }
        ]
    });
    res.json(response);
    return;
});

gameRouter.put('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, { newTimeLeft: number }>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }
    const response = await Game.findByPk(req.params.id, {
        include: [
            {
                model: Move,
                as: 'moveHistory'
            },
            {
                model: models.User,
                as: 'player1',
                attributes: { exclude: ['password'] }
            },
            {
                model: models.User,
                as: 'player2',
                attributes: { exclude: ['password'] }
            }
        ]
    });
    if (!response) {
        res.json({ message: 'Game not found' });
        return;
    }
    if (req.user.id === response.player1Id) {
        const newPlayer1LastMoveTime = new Date();
        const result = await response.update({ player1TimeLeft: req.body.newTimeLeft, player1LastMoveTime: newPlayer1LastMoveTime });
        res.json({ message: 'Update successfully', result });
    } else {
        const newPlayer2LastMoveTime = new Date();
        const result = await response.update({ player2TimeLeft: req.body.newTimeLeft, player2LastMoveTime: newPlayer2LastMoveTime });
        res.json({ message: 'Update successfully', result });
    }
});

gameRouter.put('/:id/draw', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }
    const game = await Game.findByPk(req.params.id);
    if (!game) {
        res.json({ error: 'Game not found' });
        return;
    }
    const response = await game.update({ isDraw: true });
    res.json(response);
    return;
});

gameRouter.put('/:id/specific-result', tokenExtractor, async (req: Request<{ id: string }, unknown, { winnerId: string, loserId: string }>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
    }
    const game = await Game.findByPk(req.params.id);
    if (!game) {
        res.json({ error: 'Game not found' });
        return;
    }
    console.log('This is winner and loser', req.body.winnerId, req.body.loserId);

    const response = await game.update({ winnerId: req.body.winnerId, loserId: req.body.loserId });
    res.json(response);
    return;

});

export default gameRouter;