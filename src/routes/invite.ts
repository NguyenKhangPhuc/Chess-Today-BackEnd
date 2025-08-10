import express, { Request, Response } from "express";
import models from "../models";
import { InvitationAttributes } from '../types/types';
import { tokenExtractor } from "../utils/middleware";
import { Op } from "sequelize";
import Invitation from "../models/invitation";
import User from "../models/user";
import { PaginationCursor } from "../helpers/pagination";
const inviteRouter = express.Router();

inviteRouter.get('/sender/user/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    const { limit, after, before } = req.query;
    let where = {};
    if (after) {
        where = {
            [Op.and]: [
                { senderId: req.params.id },
                { createdAt: { [Op.lt]: after } }
            ]
        };
    }
    if (before) {
        where = {
            [Op.and]: [
                { senderId: req.params.id },
                { createdAt: { [Op.gt]: before } }
            ]
        };
    }
    try {
        const response = await Invitation.findAll({
            where: Object.keys(where).length > 0 ? where : {
                senderId: req.params.id
            },
            order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
            limit: Number(limit) + 1,
            include: [
                {
                    model: User,
                    as: 'receiver',
                    attributes: { exclude: ['password'] }
                }
            ]
        });
        const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<InvitationAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
        res.json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
        return;
    } catch (error) {
        console.log(error);
    }
});

inviteRouter.get('/receiver/user/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    const { limit, after, before } = req.query;
    let where = {};
    if (after) {
        where = {
            [Op.and]: [
                { receiverId: req.params.id },
                { createdAt: { [Op.lt]: after } }
            ]
        };
    }
    if (before) {
        where = {
            [Op.and]: [
                { receiverId: req.params.id },
                { createdAt: { [Op.gt]: before } }
            ]
        };
    }
    try {
        const response = await Invitation.findAll({
            where: Object.keys(where).length > 0 ? where : {
                receiverId: req.params.id
            },
            order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
            limit: Number(limit) + 1,
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: { exclude: ['password'] }
                }
            ]
        });
        const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<InvitationAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
        res.json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
        return;
    } catch (error) {
        console.log(error);
    }
});

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