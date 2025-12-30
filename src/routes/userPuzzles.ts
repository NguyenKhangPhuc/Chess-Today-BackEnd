import express from 'express';
import { Response, Request } from 'express';
import { tokenExtractor } from '../utils/middleware';
import UserPuzzles from '../models/userPuzzles';
import { UserPuzzleRelationAttribute } from '../types/userPuzzles';
import { PUZZLE_STATUS } from '../types/enum';

const userPuzzlesRouter = express.Router();

// Route the get all the user-puzzles (puzzles solved) from the verified user
userPuzzlesRouter.get('/userId', tokenExtractor, async (req: Request, res: Response) => {
    // Get all the user puzzles based on the userId
    const response = await UserPuzzles.findAll({
        where: { userId: req.user!.id }
    });
    res.status(200).json(response);
    return;
});

// Route to create a user-puzzle relation (meaning that the user has solved the puzzle)
userPuzzlesRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, { puzzleId: string, userId: string }>, res: Response) => {
    // Create a puzzle object to be inserted to the user_puzzles table
    const userPuzzle: UserPuzzleRelationAttribute = {
        puzzleId: req.body.puzzleId,
        userId: req.body.userId,
        attempt: 1,
        status: PUZZLE_STATUS.SOLVED,
    };
    // Find if the relation already exists
    const foundRelation = await UserPuzzles.findOne({
        where: { puzzleId: req.body.puzzleId, userId: req.body.userId }
    });
    // If yes -> No need to create new
    if (foundRelation) {
        res.status(200).json({
            message: 'Relation already exists',
        });
        return;
    }
    // Create new user_puzzles relation
    const response = await UserPuzzles.create(userPuzzle);
    if (!response) {
        res.status(500).json({ error: 'Cannot create user puzzle relation' });
        return;
    }
    res.status(200).json(response);
});

export default userPuzzlesRouter;