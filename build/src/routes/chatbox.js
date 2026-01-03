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
const chatbox_1 = __importDefault(require("../models/chatbox"));
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("../models/user"));
const message_1 = __importDefault(require("../models/message"));
const chatBoxRouter = express_1.default.Router();
// Route to get all the chatbox of the verified user
chatBoxRouter.get('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find all the chatbox where the userId is either user1Id or user2Id, using join query on User and Message table.
    const response = yield chatbox_1.default.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { user1Id: req.user.id },
                { user2Id: req.user.id }
            ]
        },
        include: [
            {
                model: user_1.default,
                as: 'user1',
                attributes: ['id', 'name', 'username']
            },
            {
                model: user_1.default,
                as: 'user2',
                attributes: ['id', 'name', 'username']
            },
            {
                model: message_1.default,
                as: 'messages'
            }
        ]
    });
    // If the response is null -> error
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
// Route to create a chatbox
chatBoxRouter.post('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // userA and userB are the indexes of the chatbox tables, normalize them before create
    // so that we can avoid duplicate chatbox of the same user.
    const [userA, userB] = req.body.user1Id < req.body.user2Id
        ? [req.body.user1Id, req.body.user2Id]
        : [req.body.user2Id, req.body.user1Id];
    // Store the value to the body object and create the chatbox
    req.body.userA = userA;
    req.body.userB = userB;
    const response = yield chatbox_1.default.create(req.body);
    // If the response is null -> error
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
exports.default = chatBoxRouter;
