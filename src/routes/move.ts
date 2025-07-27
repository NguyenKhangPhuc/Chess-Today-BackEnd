import express, { Request, Response } from 'express';
import { MoveAttributes } from '../types/types';
import Move from '../models/move';

const moveRouter = express.Router();

moveRouter.post('/', async (req: Request<unknown, unknown, MoveAttributes>, res: Response) => {
    const move = req.body;
    try {
        const response = await Move.create(move);
        res.json(response);
        return;
    } catch (error) {
        console.log(error);
    }
});

export default moveRouter;