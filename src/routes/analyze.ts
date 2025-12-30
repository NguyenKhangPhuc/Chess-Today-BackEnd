/// Route to get the move from the Stockfish and to get the explanation of the move from OpenAI
import express, { Request, Response } from 'express';
import { StockfishEngine } from '../../engine/StockfishEngine';
import { openAIEngine } from '../../engine/OpenAIEngine';
import { EngineScore } from '../types/types';
import GameMessage from '../models/gameMessage';
import { tokenExtractor } from '../utils/middleware';
import Game from '../models/game';
const analyzeRouter = express.Router();

// Route to get the move from Stockfish engine
analyzeRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, { fen: string, gameId: string }>, res: Response) => {


    // Find the game by its id
    const response = await Game.findByPk(req.body.gameId);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Check if the user are the players in the game.
    if (req.user!.id != response.player1Id && req.user!.id != response.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Get the fen from the front-end
    const fen = req.body.fen;

    if (!fen) {
        res.status(401).json({ error: 'FEN is required' });
        return;
    }
    // Initialize the stockfish engine
    const engine = new StockfishEngine();
    // Get the move information from the stockfish engine with the fen above and with depth 20
    const moveInfo = await engine.evaluateFen(fen, 20);
    // Stop the Engine
    engine.stop();
    // If the response is null -> Internal server error
    if (!moveInfo) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json({ moveInfo });
    return;
});

// Route to analyze the score of the move from the user
analyzeRouter.post('/explanation', tokenExtractor, async (req: Request<unknown, unknown, { move: string, beforeFen: string, score: EngineScore | null, senderId: string, gameId: string }>, res: Response) => {
    // Find the game by its id
    const foundGame = await Game.findByPk(req.body.gameId);
    if (!foundGame) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Check if the user are the players in the game.
    if (req.user!.id != foundGame.player1Id && req.user!.id != foundGame.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }

    let score = req.body.score;
    // Get the score from the body;
    console.log('This is game Id and sender Id', req.body.gameId, req.body.senderId);
    if (!score) {
        // If the score is null -> initialize the stockfish engine
        const engine = new StockfishEngine();
        // Analyze the move from the front-end with fen value before moving, get the score
        const { score: receivedScore } = await engine.evaluateMoveScore(req.body.beforeFen, req.body.move);
        if (!receivedScore) {
            // If the response is null -> error
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // If not -> store the score of the move
        score = receivedScore;
    }

    // Call the OpenAI engine method to analyze the move above with the given information: move, fen, score.
    const response = await openAIEngine.explainMove({ bestMove: req.body.move, fen: req.body.beforeFen, score: score });
    // If the explanation is empty or null -> error
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    // Create the object with explanation and its owner.
    const gameMessage = {
        senderId: req.body.senderId,
        gameId: req.body.gameId,
        content: response
    };
    // Store the explanation to database and return it.
    await GameMessage.create(gameMessage);
    res.status(200).json(response);
    return;
});

export default analyzeRouter;