import express, { Request, Response } from 'express';
import Game from '../models/game';
import Move from '../models/move';
import models from '../models';
import { tokenExtractor } from '../utils/middleware';
import { Op } from 'sequelize';
import { PaginationCursor } from '../helpers/pagination';
import User from '../models/user';
import { GameAttributes } from '../types/game';
import { GAME_STATUS } from '../types/enum';

const gameRouter = express.Router();

// Route to create a new game base on the given info from the request
gameRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, GameAttributes>, res: Response) => {
    // Get the game info from the request body
    const game = req.body;
    // Create the game
    const response = await Game.create(game);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

// Route to create a game with a bot
gameRouter.post('/bot', tokenExtractor, async (req: Request<unknown, unknown, { type: string }>, res: Response) => {
    // Find the bot user in the users table
    const bot = await User.findOne({
        where: {
            isBot: true
        },
        attributes: { exclude: ['password'] }
    });
    // If it not exists -> error
    if (!bot) {
        res.status(401).json({ error: 'Bot not found' });
        return;
    }
    // Create a game with the bot and the user
    const response = await Game.create(
        { player1Id: req.body.type === 'white' ? req.user!.id : bot.id, player2Id: req.body.type === 'white' ? bot.id : req.user!.id, isBotGame: true }
    );
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json({ response });
    return;
});


// Get all the games of the verified user
gameRouter.get('/user/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    // Get the query params from the front-end including cursor after - before and limit to take
    const { after, before, limit } = req.query;
    if (!limit) {
        res.status(401).json({ error: 'Missing limit' });
        return;
    }
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is either player1Id or player2Id
    // Besides, the value of there created_at field must be less than after cursor (older than the cursor)
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
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is either player1Id or player2Id
    // Besides, the value of there created_at field must be greater than before cursor (newer than the cursor)
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

    // Find all the user's games with the where condition above
    // If there exists no after and before cursor -> get data if userId = player1Id or userId = player2Id
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
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
                as: 'moveHistory',
                attributes: ['id']
            },
            {
                model: models.User,
                as: 'player1',
                attributes: ['id', 'name', 'username']
            },
            {
                model: models.User,
                as: 'player2',
                attributes: ['id', 'name', 'username']
            }
        ]
    });

    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Get the new next/prev cursor and the boolean value which show if there exists next/prev page.
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = PaginationCursor<GameAttributes>(response, Number(limit), after as string | undefined, before as string | undefined);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
});

// Route to get a specific game
gameRouter.get('/:id', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    // Find a specific game based on its Id
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

// Route to check if there are already ongoing game.
gameRouter.post('/check-ongoing-game', tokenExtractor, async (req: Request, res: Response) => {
    // Find a game where userId = player1Id/player2Id and it is not bot game and it is currentlyPlaying
    const where = {
        [Op.and]: [
            {
                [Op.or]: [
                    { player1Id: req.user?.id },
                    { player2Id: req.user?.id }
                ]
            },
            { isBotGame: false },
            { gameStatus: GAME_STATUS.PLAYING }
        ]
    };
    const response = await Game.findOne({ where });
    if (response) {
        res.status(409).json({ errorCode: "GAME_IN_PROGRESS", error: "Game is currently ongoing", game: response });
        return;
    }
    res.status(200).json({ message: 'No ongoing game' });
});

// Route to update the game result and game status
gameRouter.put('/:id/draw', tokenExtractor, async (req: Request<{ id: string }>, res: Response) => {
    // Find the game based on its id
    const game = await Game.findByPk(req.params.id);
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the game is already finished
    if (game.gameStatus == GAME_STATUS.FINISHED) {
        res.status(200).json({ message: 'Game already finished' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user!.id != game.player1Id && req.user!.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Update the game result to Draw and the game status to finished
    const response = await game.update({ isDraw: true, gameStatus: GAME_STATUS.FINISHED });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
});

// Route to update the game result and game status
gameRouter.put('/:id/specific-result', tokenExtractor, async (req: Request<{ id: string }, unknown, { winnerId: string, loserId: string }>, res: Response) => {
    // Find the game based on its id
    const game = await Game.findByPk(req.params.id);
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the game is already finished
    if (game.gameStatus == GAME_STATUS.FINISHED) {
        res.status(200).json({ message: 'Game already finished' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user!.id != game.player1Id && req.user!.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Update the game result, the winner, the loser and the game status
    const response = await game.update({ winnerId: req.body.winnerId, loserId: req.body.loserId, gameStatus: GAME_STATUS.FINISHED });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;

});

export default gameRouter;