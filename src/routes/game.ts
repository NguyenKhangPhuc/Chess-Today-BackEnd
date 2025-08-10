import express, { Request, Response } from 'express';
import { GAME_STATUS, GameAttributes } from '../types/types';
import Game from '../models/game';
import Move from '../models/move';
import models from '../models';
import { tokenExtractor } from '../utils/middleware';
import { Op } from 'sequelize';
import { PaginationCursor } from '../helpers/pagination';

const gameRouter = express.Router();

gameRouter.post('/', async (req: Request<unknown, unknown, GameAttributes>, res: Response) => {
    const game = req.body;
    try {
        const response = await Game.create(game);
        res.json(response);
    } catch (err) {
        console.log(err);
    }
});

gameRouter.get('/', async (_: Request, res: Response) => {
    const response = await Game.findAll({
        include: [
            {
                model: Move,
                as: 'moveHistory'
            },
        ]

    });
    res.json(response);
    return;
});

gameRouter.get('/user/:id', async (req: Request<{ id: string }>, res: Response) => {
    const { after, before, limit } = req.query;
    if (!limit) {
        res.json({ error: 'missing limit' });
        return;
    }
    let where = {};
    if (after) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { player1Id: req.params?.id },
                        { player2Id: req.params?.id }
                    ]
                },
                { createdAt: { [Op.lt]: after } }
            ],
        };
    }

    if (before) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { player1Id: req.params?.id },
                        { player2Id: req.params?.id }
                    ]
                },
                { createdAt: { [Op.gt]: before } }
            ]
        };
    }
    try {
        const response = await Game.findAll({
            where: Object.keys(where).length > 0 ? where : {
                [Op.or]: [
                    { player1Id: req.params?.id },
                    { player2Id: req.params?.id }
                ]
            },
            order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
            limit: Number(limit) + 1,
            include: [
                {
                    model: Move,
                    as: 'moveHistory'
                },
                {
                    model: models.User,
                    as: 'player1',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: models.User,
                    as: 'player2',
                    attributes: { exclude: ['password'] }
                }
            ]
        });
        const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<GameAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
        res.json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
        return;
    } catch (error) {
        console.log('This is error', error);
    }
});


gameRouter.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    const response = await Game.findByPk(req.params.id, {
        include: [
            {
                model: Move,
                as: 'moveHistory'
            },
            {
                model: models.User,
                as: 'player1',
                attributes: { exclude: ['password'] }
            },
            {
                model: models.User,
                as: 'player2',
                attributes: { exclude: ['password'] }
            }
        ]
    });
    res.json(response);
    return;
});

gameRouter.put('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, { newTimeLeft: number }>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }
    const response = await Game.findByPk(req.params.id, {
        include: [
            {
                model: Move,
                as: 'moveHistory'
            },
            {
                model: models.User,
                as: 'player1',
                attributes: { exclude: ['password'] }
            },
            {
                model: models.User,
                as: 'player2',
                attributes: { exclude: ['password'] }
            }
        ]
    });
    if (!response) {
        res.json({ message: 'Game not found' });
        return;
    }
    if (req.user.id === response.player1Id) {
        const newPlayer1LastMoveTime = new Date();
        const result = await response.update({ player1TimeLeft: req.body.newTimeLeft, player1LastMoveTime: newPlayer1LastMoveTime });
        res.json({ message: 'Update successfully', result });
    } else {
        const newPlayer2LastMoveTime = new Date();
        const result = await response.update({ player2TimeLeft: req.body.newTimeLeft, player2LastMoveTime: newPlayer2LastMoveTime });
        res.json({ message: 'Update successfully', result });
    }
});

gameRouter.put('/:id/draw', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
        return;
    }
    const game = await Game.findByPk(req.params.id);
    if (!game) {
        res.json({ error: 'Game not found' });
        return;
    }
    const response = await game.update({ isDraw: true, gameStatus: GAME_STATUS.FINISHED });
    res.json(response);
    return;
});

gameRouter.put('/:id/specific-result', tokenExtractor, async (req: Request<{ id: string }, unknown, { winnerId: string, loserId: string }>, res: Response) => {
    if (!req.user) {
        res.json({ error: 'Not authenticated' });
    }
    const game = await Game.findByPk(req.params.id);
    if (!game) {
        res.json({ error: 'Game not found' });
        return;
    }
    console.log('This is winner and loser', req.body.winnerId, req.body.loserId);

    const response = await game.update({ winnerId: req.body.winnerId, loserId: req.body.loserId, gameStatus: GAME_STATUS.FINISHED });
    res.json(response);
    return;

});

export default gameRouter;