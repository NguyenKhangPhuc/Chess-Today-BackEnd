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
const userPuzzles_1 = __importDefault(require("../models/userPuzzles"));
const enum_1 = require("../types/enum");
const userPuzzlesRouter = express_1.default.Router();
// Route the get all the user-puzzles (puzzles solved) from the verified user
userPuzzlesRouter.get('/userId', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all the user puzzles based on the userId
    const response = yield userPuzzles_1.default.findAll({
        where: { userId: req.user.id }
    });
    res.status(200).json(response);
    return;
}));
// Route to create a user-puzzle relation (meaning that the user has solved the puzzle)
userPuzzlesRouter.post('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a puzzle object to be inserted to the user_puzzles table
    const userPuzzle = {
        puzzleId: req.body.puzzleId,
        userId: req.body.userId,
        attempt: 1,
        status: enum_1.PUZZLE_STATUS.SOLVED,
    };
    // Find if the relation already exists
    const foundRelation = yield userPuzzles_1.default.findOne({
        where: { puzzleId: req.body.puzzleId, userId: req.body.userId }
    });
    // If yes -> No need to create new
    if (foundRelation) {
        res.status(200).json({
            message: 'Relation already exists',
        });
        return;
    }
    // Create new user_puzzles relation
    const response = yield userPuzzles_1.default.create(userPuzzle);
    if (!response) {
        res.status(500).json({ error: 'Cannot create user puzzle relation' });
        return;
    }
    res.status(200).json(response);
}));
exports.default = userPuzzlesRouter;
