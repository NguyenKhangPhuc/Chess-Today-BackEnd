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
const move_1 = __importDefault(require("../models/move"));
const middleware_1 = require("../utils/middleware");
const user_1 = __importDefault(require("../models/user"));
const game_1 = __importDefault(require("../models/game"));
const moveRouter = express_1.default.Router();
// Route to create the move in game
moveRouter.post('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the gameId and check if it exists
    const game = yield game_1.default.findByPk(req.body.gameId);
    if (!game) {
        res.status(401).json({ error: 'Game not found' });
        return;
    }
    // Check if the verified user is the player of the game
    if (req.user.id != game.player1Id && req.user.id != game.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    const move = req.body;
    // Create the move
    const response = yield move_1.default.create(move);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
// Route to find all move of a specific game
moveRouter.get('/game/:id', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find all the move with the given gameId
    console.log(req.params.id, "Games move");
    const response = yield move_1.default.findAll({
        where: {
            gameId: req.params.id
        },
        order: [['createdAt', 'ASC']],
        include: [
            {
                model: user_1.default,
                as: 'mover',
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
exports.default = moveRouter;
