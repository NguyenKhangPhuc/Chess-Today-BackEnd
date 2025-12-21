import express from 'express';
import { Response, Request } from 'express';
import { tokenExtractor } from '../utils/middleware';
import { ChallengeAttributes } from '../types/types';
import Challenge from '../models/challenges';
import { Op } from 'sequelize';

const challengeRouter = express.Router();


challengeRouter.get('/', tokenExtractor, async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const response = await Challenge.findAll({ where: { [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }] } });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});
challengeRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, unknown>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const response = await Challenge.findByPk(req.params.id);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

challengeRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, { challenge: ChallengeAttributes }>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    console.log(req.body.challenge);
    const response = await Challenge.create(req.body.challenge);
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(response);
});

export default challengeRouter;