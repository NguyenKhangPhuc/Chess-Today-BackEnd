
import express, { Request, Response } from 'express';
import { StockfishEngine } from '../../engine/StockfishEngine';
import { openAIEngine } from '../../engine/OpenAIEngine';
const analyzeRouter = express.Router();


analyzeRouter.post('/', async (req: Request<unknown, unknown, { fen: string }>, res: Response) => {
    const fen = req.body.fen;

    if (!fen) {
        res.status(400).json({ error: 'FEN is required' });
        return;
    }

    const engine = new StockfishEngine();
    const moveInfo = await engine.evaluateFen(fen, 20);
    const response = await openAIEngine.explainMove({ ...moveInfo, fen });
    engine.stop();
    res.json({ moveInfo, explanation: response });
});

export default analyzeRouter;