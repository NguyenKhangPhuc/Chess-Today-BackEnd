import express, { Request, Response } from "express";
import models from "../models";
import { InvitationType } from '../types/types';
const inviteRouter = express.Router();

inviteRouter.post('/', async (req: Request<unknown, unknown, InvitationType>, res: Response) => {
    const invitation = req.body;
    const reponse = await models.Invitation.create(invitation);
    res.json(reponse);
    return;
});

export default inviteRouter;