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
const puzzle_1 = __importDefault(require("../models/puzzle"));
const middleware_1 = require("../utils/middleware");
const puzzleMove_1 = __importDefault(require("../models/puzzleMove"));
const puzzleRouter = express_1.default.Router();
// Route to get all the puzzles and include its valid moves
puzzleRouter.get('/', middleware_1.tokenExtractor, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all the puzzle and its valid moves
    const response = yield puzzle_1.default.findAll({
        include: [
            {
                model: puzzleMove_1.default,
                as: 'validMoves',
            }
        ]
    });
    if (response) {
        res.status(200).json(response);
        return;
    }
    res.status(500).json({ error: 'Cannot find puzzles' });
    return;
}));
exports.default = puzzleRouter;
