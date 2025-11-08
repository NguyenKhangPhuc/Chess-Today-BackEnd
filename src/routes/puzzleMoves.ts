import express from 'express';
import { Response, Request } from 'express';
import { tokenExtractor } from '../utils/middleware';
import PuzzleMove from '../models/puzzleMove';

const puzzleMovesRouter = express.Router();

puzzleMovesRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    const response = await PuzzleMove.findByPk(req.params.id);
    if (!response) {
        res.status(500).json({ error: 'Cannot fetch puzzle move by puzzle id' });
        return;
    }
    res.status(200).json(response);
    return;
});

export default puzzleMovesRouter;