import express, { Request, Response } from 'express';
import { GAME_STATUS, GameAttributes } from '../types/types';
import Game from '../models/game';
import Move from '../models/move';
import models from '../models';
import { tokenExtractor } from '../utils/middleware';
import { Op } from 'sequelize';
import { PaginationCursor } from '../helpers/pagination';
import User from '../models/user';

const gameRouter = express.Router();

gameRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, GameAttributes>, res: Response) => {
    const game = req.body;
    const response = await Game.create(game);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

gameRouter.post('/bot', tokenExtractor, async (req: Request<unknown, unknown, { type: string }>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const bot = await User.findOne({
        where: {
            isBot: true
        },
        attributes: { exclude: ['password'] }
    });
    if (!bot) {
        res.status(401).json({ error: 'Bot not found' });
        return;
    }
    const response = await Game.create({ player1Id: req.body.type === 'white' ? req.user.id : bot.id, player2Id: req.body.type === 'white' ? bot.id : req.user.id, isBotGame: true });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json({ response });
    return;
});

gameRouter.put('/fen/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, { fen: string }>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const game = await Game.findByPk(req.params.id, {
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
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    await game.update({
        fen: req.body.fen
    });

    res.status(200).json(game);
    return;
});

gameRouter.get('/', tokenExtractor, async (_: Request, res: Response) => {
    const response = await Game.findAll({
        include: [
            {
                model: Move,
                as: 'moveHistory'
            },
        ]

    });

    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

gameRouter.get('/user/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    const { after, before, limit } = req.query;
    if (!limit) {
        res.status(401).json({ error: 'Missing limit' });
        return;
    }
    console.log(after, before, limit);
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
    const response = await Game.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
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

    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<GameAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
});


gameRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
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
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

gameRouter.put('/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, { newTimeLeft: number }>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
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
        res.status(401).json({ message: 'Game not found' });
        return;
    }
    if (req.user.id === response.player1Id) {
        const newPlayer1LastMoveTime = new Date();
        const result = await response.update({ player1TimeLeft: req.body.newTimeLeft, player1LastMoveTime: newPlayer1LastMoveTime });
        if (!result) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json({ message: 'Update successfully', result });
        return;
    } else {
        const newPlayer2LastMoveTime = new Date();
        const result = await response.update({ player2TimeLeft: req.body.newTimeLeft, player2LastMoveTime: newPlayer2LastMoveTime });
        if (!result) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json({ message: 'Update successfully', result });
        return;
    }
});

gameRouter.put('/:id/draw', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const game = await Game.findByPk(req.params.id);
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    const response = await game.update({ isDraw: true, gameStatus: GAME_STATUS.FINISHED });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

gameRouter.put('/:id/specific-result', tokenExtractor, async (req: Request<{ id: string }, unknown, { winnerId: string, loserId: string }>, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
    }
    const game = await Game.findByPk(req.params.id);
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    console.log('This is winner and loser', req.body.winnerId, req.body.loserId);

    const response = await game.update({ winnerId: req.body.winnerId, loserId: req.body.loserId, gameStatus: GAME_STATUS.FINISHED });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;

});

export default gameRouter;