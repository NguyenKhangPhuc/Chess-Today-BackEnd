import express, { Request, Response } from "express";
import models from "../models";
import { tokenExtractor } from "../utils/middleware";
import { Op } from "sequelize";
import Invitation from "../models/invitation";
import User from "../models/user";
import { PaginationCursor } from "../helpers/pagination";
import { InvitationAttributes } from "../types/invitation";
const inviteRouter = express.Router();
// Route to get the invitation where the user is the sender
inviteRouter.get('/sender/user', tokenExtractor, async (req: Request, res: Response) => {
    const { limit, after, before } = req.query;
    console.log("Sent Invitation ", req.query);
    let where = {};
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is senderId
    // Besides, the value of there created_at field must be less than after cursor (older than the cursor)
    if (after) {
        where = {
            [Op.and]: [
                { senderId: req.user!.id },
                { createdAt: { [Op.lt]: after } }
            ]
        };
    }
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is senderId
    // Besides, the value of there created_at field must be greater than before cursor (newer than the cursor)
    if (before) {
        where = {
            [Op.and]: [
                { senderId: req.user!.id },
                { createdAt: { [Op.gt]: before } }
            ]
        };
    }
    // Find all the user's games with the where condition above
    // If there exists no after and before cursor -> get data if userId = senderId
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
    const response = await Invitation.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            senderId: req.user!.id
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
    // Get the new next/prev cursor and the boolean value which show if there exists next/prev page.
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<InvitationAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
});
// Route to get the invitation where the user is the receiver
inviteRouter.get('/receiver/user', tokenExtractor, async (req: Request, res: Response) => {
    const { limit, after, before } = req.query;
    console.log("Sent Invitation ", req.query);
    let where = {};
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is receiverId
    // Besides, the value of there created_at field must be less than after cursor (older than the cursor)
    if (after) {
        where = {
            [Op.and]: [
                { receiverId: req.user!.id },
                { createdAt: { [Op.lt]: after } }
            ]
        };
    }
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is receiverId
    // Besides, the value of there created_at field must be greater than before cursor (newer than the cursor)
    if (before) {
        where = {
            [Op.and]: [
                { receiverId: req.user!.id },
                { createdAt: { [Op.gt]: before } }
            ]
        };
    }
    console.log(where);
    // Find all the user's games with the where condition above
    // If there exists no after and before cursor -> get data if userId = receiverId
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
    const response = await Invitation.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            receiverId: req.user!.id
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
    // Get the new next/prev cursor and the boolean value which show if there exists next/prev page.
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<InvitationAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
});


// Router to create the invitation
inviteRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, InvitationAttributes>, res: Response) => {
    const { receiverId } = req.body;
    const senderId = req.user!.id;
    // userA and userB col in invitation table are indexes, it is used to prevent duplicate invitation from users to users
    // We will normalize the senderId and receiverId by using comparison operation
    const [userA, userB] =
        senderId < receiverId!
            ? [senderId, receiverId]
            : [receiverId, senderId];
    // If userA or userB == null -> error
    if (!userA || !userB) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Create the invitation with the index
    const response = await models.Invitation.create({ receiverId, senderId, userA, userB });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

// Route to delete the invitation
inviteRouter.delete('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, unknown>, res: Response) => {
    // Find the invitation based on the id
    const response = await Invitation.findByPk(req.params.id);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    // Check if the user who tried to delete it is the correct user
    if (req.user!.id != response.senderId || req.user!.id != response.receiverId) {
        res.status(401).json({ error: 'You are not allowed to do this' });
        return;
    }
    // Delete it
    await response.destroy();
    res.status(204).end();
    return;
});

export default inviteRouter;