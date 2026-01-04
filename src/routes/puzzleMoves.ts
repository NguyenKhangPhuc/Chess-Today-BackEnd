import express from 'express';
import { Response, Request } from 'express';
import { tokenExtractor } from '../utils/middleware';
import PuzzleMove from '../models/puzzleMove';

const puzzleMovesRouter = express.Router();

// Route to fetch the valid puzzle move of a puzzle by its id
puzzleMovesRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }
    // Fetch all the valid puzzle move of a puzzle
    const response = await PuzzleMove.findByPk(id);
    if (!response) {
        res.status(500).json({ error: 'Cannot fetch puzzle move by puzzle id' });
        return;
    }
    res.status(200).json(response);
    return;
});

export default puzzleMovesRouter;