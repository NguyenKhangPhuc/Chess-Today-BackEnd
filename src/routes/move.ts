import express, { Request, Response } from 'express';
import { MoveAttributes } from '../types/types';
import Move from '../models/move';
import { tokenExtractor } from '../utils/middleware';
import User from '../models/user';
import Game from '../models/game';
const moveRouter = express.Router();

// Route to create the move in game
moveRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, MoveAttributes>, res: Response) => {
    // Find the gameId and check if it exists
    const game = await Game.findByPk(req.body.gameId);
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user!.id != game.player1Id && req.user!.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    const move = req.body;
    // Create the move
    const response = await Move.create(move);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

// Route to find all move of a specific game
moveRouter.get('/game/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    // Find all the move with the given gameId
    const response = await Move.findAll({
        where: {
            gameId: req.params.id
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