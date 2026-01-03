"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const game_1 = __importDefault(require("../models/game"));
const move_1 = __importDefault(require("../models/move"));
const models_1 = __importDefault(require("../models"));
const middleware_1 = require("../utils/middleware");
const sequelize_1 = require("sequelize");
const pagination_1 = require("../helpers/pagination");
const user_1 = __importDefault(require("../models/user"));
const enum_1 = require("../types/enum");
const gameRouter = express_1.default.Router();
// Route to create a new game base on the given info from the request
gameRouter.post('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the game info from the request body
    const game = req.body;
    // Create the game
    const response = yield game_1.default.create(game);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
// Route to create a game with a bot
gameRouter.post('/bot', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the bot user in the users table
    const bot = yield user_1.default.findOne({
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
    const response = yield game_1.default.create({ player1Id: req.body.type === 'white' ? req.user.id : bot.id, player2Id: req.body.type === 'white' ? bot.id : req.user.id, isBotGame: true });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json({ response });
    return;
}));
// Get all the games of the verified user
gameRouter.get('/user/:id', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
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
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        { player1Id: (_a = req.params) === null || _a === void 0 ? void 0 : _a.id },
                        { player2Id: (_b = req.params) === null || _b === void 0 ? void 0 : _b.id }
                    ]
                },
                { createdAt: { [sequelize_1.Op.lt]: after } }
            ],
        };
    }
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is either player1Id or player2Id
    // Besides, the value of there created_at field must be greater than before cursor (newer than the cursor)
    if (before) {
        where = {
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        { player1Id: (_c = req.params) === null || _c === void 0 ? void 0 : _c.id },
                        { player2Id: (_d = req.params) === null || _d === void 0 ? void 0 : _d.id }
                    ]
                },
                { createdAt: { [sequelize_1.Op.gt]: before } }
            ]
        };
    }
    // Find all the user's games with the where condition above
    // If there exists no after and before cursor -> get data if userId = player1Id or userId = player2Id
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
    const response = yield game_1.default.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            [sequelize_1.Op.or]: [
                { player1Id: (_e = req.params) === null || _e === void 0 ? void 0 : _e.id },
                { player2Id: (_f = req.params) === null || _f === void 0 ? void 0 : _f.id }
            ]
        },
        order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
        limit: Number(limit) + 1,
        include: [
            {
                model: move_1.default,
                as: 'moveHistory',
                attributes: ['id']
            },
            {
                model: models_1.default.User,
                as: 'player1',
                attributes: ['id', 'name', 'username']
            },
            {
                model: models_1.default.User,
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
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = (0, pagination_1.PaginationCursor)(response, Number(limit), after, before);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
}));
// Route to get a specific game
gameRouter.get('/:id', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find a specific game based on its Id
    const response = yield game_1.default.findByPk(req.params.id, {
        include: [
            {
                model: move_1.default,
                as: 'moveHistory'
            },
            {
                model: models_1.default.User,
                as: 'player1',
                attributes: { exclude: ['password'] }
            },
            {
                model: models_1.default.User,
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
}));
// Route to check if there are already ongoing game.
gameRouter.post('/check-ongoing-game', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Find a game where userId = player1Id/player2Id and it is not bot game and it is currentlyPlaying
    const where = {
        [sequelize_1.Op.and]: [
            {
                [sequelize_1.Op.or]: [
                    { player1Id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                    { player2Id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id }
                ]
            },
            { isBotGame: false },
            { gameStatus: enum_1.GAME_STATUS.PLAYING }
        ]
    };
    const response = yield game_1.default.findOne({ where });
    if (response) {
        res.status(409).json({ errorCode: "GAME_IN_PROGRESS", error: "Game is currently ongoing", game: response });
        return;
    }
    res.status(200).json({ message: 'No ongoing game' });
}));
// Route to update the game result and game status
gameRouter.put('/:id/draw', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the game based on its id
    const game = yield game_1.default.findByPk(req.params.id);
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the game is already finished
    if (game.gameStatus == enum_1.GAME_STATUS.FINISHED) {
        res.status(200).json({ message: 'Game already finished' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user.id != game.player1Id && req.user.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Update the game result to Draw and the game status to finished
    const response = yield game.update({ isDraw: true, gameStatus: enum_1.GAME_STATUS.FINISHED });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
// Route to update the game result and game status
gameRouter.put('/:id/specific-result', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the game based on its id
    const game = yield game_1.default.findByPk(req.params.id);
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the game is already finished
    if (game.gameStatus == enum_1.GAME_STATUS.FINISHED) {
        res.status(200).json({ message: 'Game already finished' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user.id != game.player1Id && req.user.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Update the game result, the winner, the loser and the game status
    const response = yield game.update({ winnerId: req.body.winnerId, loserId: req.body.loserId, gameStatus: enum_1.GAME_STATUS.FINISHED });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
exports.default = gameRouter;
