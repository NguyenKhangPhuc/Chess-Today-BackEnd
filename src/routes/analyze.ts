
import express, { Request, Response } from 'express';
import { StockfishEngine } from '../../engine/StockfishEngine';
import { openAIEngine } from '../../engine/OpenAIEngine';
import { EngineScore } from '../types/types';
import GameMessage from '../models/gameMessage';
const analyzeRouter = express.Router();


analyzeRouter.post('/', async (req: Request<unknown, unknown, { fen: string }>, res: Response) => {
    const fen = req.body.fen;

    if (!fen) {
        res.status(401).json({ error: 'FEN is required' });
        return;
    }

    const engine = new StockfishEngine();
    const moveInfo = await engine.evaluateFen(fen, 20);
    engine.stop();
    if (!moveInfo) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json({ moveInfo });
    return;
});


analyzeRouter.post('/explanation', async (req: Request<unknown, unknown, { move: string, beforeFen: string, score: EngineScore | null, senderId: string, gameId: string }>, res: Response) => {
    let score = req.body.score;
    console.log('This is game Id and sender Id', req.body.gameId, req.body.senderId);
    if (!score) {
        const engine = new StockfishEngine();
        const { score: receivedScore } = await engine.evaluateMoveScore(req.body.beforeFen, req.body.move);
        if (!receivedScore) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        score = receivedScore;
    }
    const response = await openAIEngine.explainMove({ bestMove: req.body.move, fen: req.body.beforeFen, score: score });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    const gameMessage = {
        senderId: req.body.senderId,
        gameId: req.body.gameId,
        content: response
    };
    await GameMessage.create(gameMessage);
    res.status(200).json(response);
    return;
});

export default analyzeRouter;