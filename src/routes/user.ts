import express, { Request, Response } from 'express';
import { tokenExtractor } from '../utils/middleware';
import models from '../models';
import { Op } from 'sequelize';
import User from '../models/user';
import { PaginationCursor } from '../helpers/pagination';
import { UserAttributes } from '../types/user';
import { GAME_TYPE } from '../types/enum';
const userRouter = express.Router();

// Route to check if the user is verified and return
userRouter.get('/check', tokenExtractor, (req: Request, res: Response) => {
    // Return the user basic info if exists
    if (req.user?.id) {
        res.status(200).json({ userInfo: req.user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
    return;
});

// Route to get all the people who are not the verified user's friends
userRouter.get('/people', tokenExtractor, async (req: Request, res: Response) => {
    // Find all the verified user's friends
    const userFriends = await models.FriendShip.findAll({
        where: {
            [Op.or]: [
                { userId: req.user!.id },
                { friendId: req.user!.id }
            ]
        }
    });
    // Create an array from a set of unique id including friends id and userId
    const excludeIds: Array<string> = Array.from(new Set(
        userFriends.flatMap((e) => {
            if (e.userId === req.user?.id) return [e.friendId];
            else if (e.friendId === req.user?.id) return [e.userId];
            return [];
        })
    ));

    const { limit, after, before } = req.query;
    let where = {};
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is not from the id from the excludedIds array, including the user;
    // Besides, the value of there created_at field must be less than after cursor (older than the cursor) and must not be a bot
    if (after) {
        where = {
            [Op.and]: [
                { createdAt: { [Op.lt]: after }, },
                { id: { [Op.notIn]: [...excludeIds] } },
                { isBot: false }
            ]
        };
    }
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is not from the id from the excludedIds array, including the user;
    // Besides, the value of there created_at field must be greater than after cursor (newer than the cursor) and must not be a bot
    if (before) {
        where = {
            [Op.and]: [
                { createdAt: { [Op.gt]: before }, },
                { id: { [Op.notIn]: [...excludeIds] } },
                { isBot: false }
            ]
        };
    }
    // Find all the user's games with the where condition above
    // If there exists no after and before cursor -> get data where the id is not from the excludeIds and not a bot
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
    const response = await models.User.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            id: { [Op.notIn]: [...excludeIds] },
            isBot: false
        },
        order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
        limit: Number(limit) + 1,
        attributes: { exclude: ['password'] },
    });
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    // Get the new next/prev cursor and the boolean value which show if there exists next/prev page.
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<UserAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
});

// Route to get the verified user information
userRouter.get('/', tokenExtractor, async (req: Request, res: Response) => {
    // Get the user information based on the userId, including information about friends also
    const response = await models.User.findByPk(req.user?.id, {
        attributes: { exclude: ['password'] },
        include: [
            {
                model: models.User,
                as: 'friends',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
            {
                model: models.User,
                as: 'friendOf',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
        ]
    });
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(response);
});

// Route to get the information of the specific user information based on their id through request params
userRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, unknown>, res: Response) => {
    console.log(req.params.id, "Params id");
    // Get the specific user information through the req params, including the friends
    const response = await models.User.findByPk(req.params?.id, {
        attributes: { exclude: ['password'] },
        include: [

            {
                model: models.User,
                as: 'friends',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
            {
                model: models.User,
                as: 'friendOf',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
        ]
    });
    console.log(response);
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(response);
});

// Route to update the user elo based on the gameType
userRouter.put('/update-elo', tokenExtractor, async (req: Request<unknown, unknown, { gameType: GAME_TYPE, userElo: number }>, res: Response) => {
    // Find the user based on the id from the decoded token
    const user = await User.findByPk(req.user!.id);
    if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
    }
    // Map to map the gameType to the user field
    const fieldMap: Record<GAME_TYPE, keyof User> = {
        [GAME_TYPE.ROCKET]: 'rocketElo',
        [GAME_TYPE.BLITZ]: 'blitzElo',
        [GAME_TYPE.RAPID]: 'elo',
    };
    // Get the suitable field from the gameType
    const fieldToUpdate = fieldMap[req.body.gameType];
    if (!fieldToUpdate) {
        // Return if field is inccorect
        res.status(400).json({ error: 'Game type incorrect' });
        return;
    }
    // Update the suitable field above
    const response = await user.update({
        [fieldToUpdate]: req.body.userElo
    });
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(response);
    return;
});

//


export default userRouter;