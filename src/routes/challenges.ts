import express from 'express';
import { Response, Request } from 'express';
import { tokenExtractor } from '../utils/middleware';
import Challenge from '../models/challenges';
import { Op } from 'sequelize';
import { ChallengeAttributes } from '../types/challenge';
import User from '../models/user';

const challengeRouter = express.Router();

// Route to get all the challenge of the verified user
challengeRouter.get('/', tokenExtractor, async (req: Request, res: Response) => {
    // Find all the challenge where the userId is either senderId or receiverId
    const response = await Challenge.findAll({ where: { [Op.or]: [{ senderId: req.user!.id }, { receiverId: req.user!.id }] } });
    if (!response) {
        // If the response is null -> Error
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

// Route to get a specific challenge
challengeRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, unknown>, res: Response) => {
    // Find the challenge by id
    const response = await Challenge.findByPk(req.params.id);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

// Route to create the challenge
challengeRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, { challenge: ChallengeAttributes }>, res: Response) => {
    // Create the challenge with the given info in the request body.
    console.log(req.body.challenge);
    const response = await Challenge.create(req.body.challenge);
    const challengeWithUser = await Challenge.findByPk(response.id, {
        include: [
            {
                model: User,
                as: 'sender',
                attributes: ['id', 'username', 'name']
            },
            {
                model: User,
                as: 'sender',
                attributes: ['id', 'username', 'name']
            }
        ]
    });
    if (!challengeWithUser) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(challengeWithUser);
});

export default challengeRouter;