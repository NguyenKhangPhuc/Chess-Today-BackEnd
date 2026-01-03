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
const challenges_1 = __importDefault(require("../models/challenges"));
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("../models/user"));
const challengeRouter = express_1.default.Router();
// Route to get all the challenge of the verified user
challengeRouter.get('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find all the challenge where the userId is either senderId or receiverId
    const response = yield challenges_1.default.findAll({ where: { [sequelize_1.Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }] } });
    if (!response) {
        // If the response is null -> Error
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
// Route to get a specific challenge
challengeRouter.get('/:id', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the challenge by id
    const response = yield challenges_1.default.findByPk(req.params.id);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
// Route to create the challenge
challengeRouter.post('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create the challenge with the given info in the request body.
    console.log(req.body.challenge);
    const response = yield challenges_1.default.create(req.body.challenge);
    const challengeWithUser = yield challenges_1.default.findByPk(response.id, {
        include: [
            {
                model: user_1.default,
                as: 'sender',
                attributes: ['id', 'username', 'name']
            },
            {
                model: user_1.default,
                as: 'sender',
                attributes: ['id', 'username', 'name']
            }
        ]
    });
    if (!challengeWithUser) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(challengeWithUser);
}));
exports.default = challengeRouter;
