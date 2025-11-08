import express from 'express';
import { Request, Response } from 'express';
import Puzzle from '../models/puzzle';
import { tokenExtractor } from '../utils/middleware';

const puzzleRouter = express.Router();

puzzleRouter.get('/', tokenExtractor, async (_: Request, res: Response) => {
    const response = await Puzzle.findAll({});
    if (response) {
        res.status(200).json(response);
        return;
    }
    res.status(500).json({ error: 'Cannot find puzzles' });
    return;
});


export default puzzleRouter;