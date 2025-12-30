import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import GameMessage from '../models/gameMessage';
import Game from '../models/game';
import { GameMessageAttributes } from '../types/gameMessage';

const gameMessageRouter = express.Router();

// Route to get all the messages of the specific game
gameMessageRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, unknown>, res: Response) => {
    // Find the game message based on the gameId
    const game = await Game.findByPk(req.params.id);
    // Check if the game exists
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user!.id != game.player1Id && req.user!.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Find all the message of the game
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

// Route to create the game message
gameMessageRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, GameMessageAttributes>, res: Response) => {
    const newMessage = req.body;
    // Find the game message based on the gameId
    const game = await Game.findByPk(newMessage.gameId);
    // Check if the game exists
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user!.id != game.player1Id && req.user!.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Create the message
    const response = await GameMessage.create(newMessage);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

export default gameMessageRouter;