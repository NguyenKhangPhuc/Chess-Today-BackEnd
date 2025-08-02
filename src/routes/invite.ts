import express, { Request, Response } from "express";
import models from "../models";
import { InvitationAttributes } from '../types/types';
import { tokenExtractor } from "../utils/middleware";
const inviteRouter = express.Router();

inviteRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, InvitationAttributes>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'not authenticated' });
        return;
    }
    const { receiverId } = req.body;
    const senderId = req.user?.id;
    const reponse = await models.Invitation.create({ receiverId, senderId });
    res.json(reponse);
    return;
});

inviteRouter.delete('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, unknown>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'not authenticated' });
        return;
    }
    await models.Invitation.destroy({
        where: { id: req.params.id }
    });
    res.json(204);
});

export default inviteRouter;