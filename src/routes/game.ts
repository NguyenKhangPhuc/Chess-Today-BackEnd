import express, { Request, Response } from 'express';
import Game from '../models/game';
import Move from '../models/move';
import models from '../models';
import { tokenExtractor } from '../utils/middleware';
import { Op } from 'sequelize';
import { PaginationCursor } from '../helpers/pagination';
import User from '../models/user';
import { GameAttributes } from '../types/game';
import { GAME_STATUS, GAME_TYPE } from '../types/enum';

const gameRouter = express.Router();

// Route to create a new game base on the given info from the request
gameRouter.post('/', tokenExtractor, async (req: Request<unknown, unknown, GameAttributes>, res: Response) => {
    const game = req.body;
    if (!game) {
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
    // Get the game info from the request body
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
    const { type } = req.body;
    if (!type) {
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
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
        { player1Id: type === 'white' ? req.user!.id : bot.id, player2Id: type === 'white' ? bot.id : req.user!.id, isBotGame: true }
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
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }
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
                        { player1Id: id },
                        { player2Id: id }
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
                        { player1Id: id },
                        { player2Id: id }
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
                { player1Id: id },
                { player2Id: id }
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
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }
    // Find a specific game based on its Id
    const response = await Game.findByPk(id, {
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
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }
    // Find the game based on its id
    const game = await Game.findByPk(id);
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
gameRouter.put('/:id/specific-result', tokenExtractor, async (req: Request<{ id: string }, unknown, { winnerId: string, loserId: string, gameType: GAME_TYPE }>, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }
    const { winnerId, loserId, gameType } = req.body;
    if (!winnerId || !loserId || !gameType) {
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
    // Find the game based on its id
    const game = await Game.findByPk(id);
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
    const gameUpdation = await game.update({ winnerId: req.body.winnerId, loserId: req.body.loserId, gameStatus: GAME_STATUS.FINISHED });

    // Return soon if it is a bot game
    if (game.isBotGame) {
        res.status(200).json({ message: 'Update successfully' });
        return;
    }

    if (!gameUpdation) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    const winner = await User.findByPk(winnerId);
    const loser = await User.findByPk(loserId);
    if (!winner || !loser) {
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
    const fieldToUpdate = fieldMap[gameType];
    if (!fieldToUpdate) {
        // Return if field is inccorect
        res.status(400).json({ error: 'Game type incorrect' });
        return;
    }
    // Update the suitable field above
    const winnerElo = winner[fieldToUpdate] as number + 8;
    const loserElo = loser[fieldToUpdate] as number - 8;
    const response = await winner.update({
        [fieldToUpdate]: winnerElo
    });
    const opponentResponse = await loser.update({ [fieldToUpdate]: loserElo });
    if (!response || !opponentResponse) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json({ message: 'Update successfully' });
    return;

});

gameRouter.put('/fen/:id', tokenExtractor, async (req: Request<{ id: string }, unknown, { fen: string }>, res: Response) => {
    // Check the params id
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }
    // Check the payload
    const { fen } = req.body;
    if (!fen) {
        res.status(400).json({ error: 'Invalid payload' });
        return;
    }
    // Find the game based on its id
    const game = await Game.findByPk(id, {
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
    // Check if the verified user is the player of the game
    if (req.user!.id != game.player1Id && req.user!.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // update the game fen
    await game.update({
        fen: fen
    });

    res.status(200).json(game);
    return;
});


export default gameRouter;