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
    console.log("Sent Invitation ", req.query);
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
    console.log(where);
    const response = await Invitation.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
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
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<InvitationAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
});

inviteRouter.get('/receiver/user/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    const { limit, after, before } = req.query;
    console.log("Sent Invitation ", req.query);
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
    console.log(where);
    const response = await Invitation.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
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

    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<InvitationAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
});

inviteRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, InvitationAttributes>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'not authenticated' });
        return;
    }
    const { receiverId } = req.body;
    const senderId = req.user?.id;
    const [userA, userB] =
        senderId < receiverId!
            ? [senderId, receiverId]
            : [receiverId, senderId];
    if (!userA || !userB) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    const response = await models.Invitation.create({ receiverId, senderId, userA, userB });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

inviteRouter.delete('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, unknown>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'not authenticated' });
        return;
    }
    await models.Invitation.destroy({
        where: { id: req.params.id }
    });
    res.status(204).end();
    return;
});

export default inviteRouter;