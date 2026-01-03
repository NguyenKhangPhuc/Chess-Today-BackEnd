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
const middleware_1 = require("../utils/middleware");
const gameMessage_1 = __importDefault(require("../models/gameMessage"));
const game_1 = __importDefault(require("../models/game"));
const gameMessageRouter = express_1.default.Router();
// Route to get all the messages of the specific game
gameMessageRouter.get('/:id', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the game message based on the gameId
    const game = yield game_1.default.findByPk(req.params.id);
    // Check if the game exists
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user.id != game.player1Id && req.user.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Find all the message of the game
    const response = yield gameMessage_1.default.findAll({
        where: {
            gameId: req.params.id
        },
    });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
}));
// Route to create the game message
gameMessageRouter.post('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = req.body;
    // Find the game message based on the gameId
    const game = yield game_1.default.findByPk(newMessage.gameId);
    // Check if the game exists
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user.id != game.player1Id && req.user.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Create the message
    const response = yield gameMessage_1.default.create(newMessage);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
exports.default = gameMessageRouter;
