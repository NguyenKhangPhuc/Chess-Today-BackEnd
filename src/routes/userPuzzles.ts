import express from 'express';
import { Response, Request } from 'express';
import { tokenExtractor } from '../utils/middleware';
import UserPuzzles from '../models/userPuzzles';
import { PUZZLE_STATUS, UserPuzzleRelationAttribute } from '../types/types';

const userPuzzlesRouter = express.Router();

userPuzzlesRouter.get('/userId', tokenExtractor, async (req: Request, res: Response) => {
    const response = await UserPuzzles.findAll({
        where: { userId: req.user!.id }
    });
    res.status(200).json(response);
    return;
});

userPuzzlesRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, { puzzleId: string, userId: string }>, res: Response) => {
    const userPuzzle: UserPuzzleRelationAttribute = {
        puzzleId: req.body.puzzleId,
        userId: req.body.userId,
        attempt: 1,
        status: PUZZLE_STATUS.SOLVED,
    };
    const foundRelation = await UserPuzzles.findOne({
        where: { puzzleId: req.body.puzzleId, userId: req.body.userId }
    });

    if (foundRelation) {
        res.status(200).json({
            message: 'Relation already exists',
        });
        return;
    }


    const response = await UserPuzzles.create(userPuzzle);
    if (!response) {
        res.status(500).json({ error: 'Cannot create user puzzle relation' });
        return;
    }
    res.status(200).json(response);
});

export default userPuzzlesRouter;