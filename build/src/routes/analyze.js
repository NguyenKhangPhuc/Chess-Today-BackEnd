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
/// Route to get the move from the Stockfish and to get the explanation of the move from OpenAI
const express_1 = __importDefault(require("express"));
const StockfishEngine_1 = require("../../engine/StockfishEngine");
const OpenAIEngine_1 = require("../../engine/OpenAIEngine");
const gameMessage_1 = __importDefault(require("../models/gameMessage"));
const middleware_1 = require("../utils/middleware");
const game_1 = __importDefault(require("../models/game"));
const analyzeRouter = express_1.default.Router();
// Route to get the move from Stockfish engine
analyzeRouter.post('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the game by its id
    const response = yield game_1.default.findByPk(req.body.gameId);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Check if the user are the players in the game.
    if (req.user.id != response.player1Id && req.user.id != response.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    // Get the fen from the front-end
    const fen = req.body.fen;
    if (!fen) {
        res.status(401).json({ error: 'FEN is required' });
        return;
    }
    // Initialize the stockfish engine
    const engine = new StockfishEngine_1.StockfishEngine();
    // Get the move information from the stockfish engine with the fen above and with depth 20
    const moveInfo = yield engine.evaluateFen(fen, 20);
    // Stop the Engine
    engine.stop();
    // If the response is null -> Internal server error
    if (!moveInfo) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json({ moveInfo });
    return;
}));
// Route to analyze the score of the move from the user
analyzeRouter.post('/explanation', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the game by its id
    const foundGame = yield game_1.default.findByPk(req.body.gameId);
    if (!foundGame) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Check if the user are the players in the game.
    if (req.user.id != foundGame.player1Id && req.user.id != foundGame.player2Id) {
        res.status(401).json({ error: 'You are not allowed to use this api' });
        return;
    }
    let score = req.body.score;
    // Get the score from the body;
    console.log('This is game Id and sender Id', req.body.gameId, req.body.senderId);
    if (!score) {
        // If the score is null -> initialize the stockfish engine
        const engine = new StockfishEngine_1.StockfishEngine();
        // Analyze the move from the front-end with fen value before moving, get the score
        const { score: receivedScore } = yield engine.evaluateMoveScore(req.body.beforeFen, req.body.move);
        if (!receivedScore) {
            // If the response is null -> error
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // If not -> store the score of the move
        score = receivedScore;
    }
    // Call the OpenAI engine method to analyze the move above with the given information: move, fen, score.
    const response = yield OpenAIEngine_1.openAIEngine.explainMove({ bestMove: req.body.move, fen: req.body.beforeFen, score: score });
    // If the explanation is empty or null -> error
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Create the object with explanation and its owner.
    const gameMessage = {
        senderId: req.body.senderId,
        gameId: req.body.gameId,
        content: response
    };
    // Store the explanation to database and return it.
    yield gameMessage_1.default.create(gameMessage);
    res.status(200).json(response);
    return;
}));
exports.default = analyzeRouter;
