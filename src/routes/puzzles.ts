import express from 'express';
import { Request, Response } from 'express';
import Puzzle from '../models/puzzle';
import { tokenExtractor } from '../utils/middleware';
import PuzzleMove from '../models/puzzleMove';

const puzzleRouter = express.Router();

puzzleRouter.get('/', tokenExtractor, async (_: Request, res: Response) => {
    const response = await Puzzle.findAll({
        include: [
            {
                model: PuzzleMove,
                as: 'validMoves',
            }
        ]
    });
    if (response) {
        res.status(200).json(response);
        return;
    }
    res.status(500).json({ error: 'Cannot find puzzles' });
    return;
});


export default puzzleRouter;