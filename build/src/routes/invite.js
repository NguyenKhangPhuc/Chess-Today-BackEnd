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
const models_1 = __importDefault(require("../models"));
const middleware_1 = require("../utils/middleware");
const sequelize_1 = require("sequelize");
const invitation_1 = __importDefault(require("../models/invitation"));
const user_1 = __importDefault(require("../models/user"));
const pagination_1 = require("../helpers/pagination");
const inviteRouter = express_1.default.Router();
// Route to get the invitation where the user is the sender
inviteRouter.get('/sender/user', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, after, before } = req.query;
    console.log("Sent Invitation ", req.query);
    let where = {};
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is senderId
    // Besides, the value of there created_at field must be less than after cursor (older than the cursor)
    if (after) {
        where = {
            [sequelize_1.Op.and]: [
                { senderId: req.user.id },
                { createdAt: { [sequelize_1.Op.lt]: after } }
            ]
        };
    }
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is senderId
    // Besides, the value of there created_at field must be greater than before cursor (newer than the cursor)
    if (before) {
        where = {
            [sequelize_1.Op.and]: [
                { senderId: req.user.id },
                { createdAt: { [sequelize_1.Op.gt]: before } }
            ]
        };
    }
    // Find all the user's games with the where condition above
    // If there exists no after and before cursor -> get data if userId = senderId
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
    const response = yield invitation_1.default.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            senderId: req.user.id
        },
        order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
        limit: Number(limit) + 1,
        include: [
            {
                model: user_1.default,
                as: 'receiver',
                attributes: { exclude: ['password'] }
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
// Route to get the invitation where the user is the receiver
inviteRouter.get('/receiver/user', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, after, before } = req.query;
    console.log("Sent Invitation ", req.query);
    let where = {};
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is receiverId
    // Besides, the value of there created_at field must be less than after cursor (older than the cursor)
    if (after) {
        where = {
            [sequelize_1.Op.and]: [
                { receiverId: req.user.id },
                { createdAt: { [sequelize_1.Op.lt]: after } }
            ]
        };
    }
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is receiverId
    // Besides, the value of there created_at field must be greater than before cursor (newer than the cursor)
    if (before) {
        where = {
            [sequelize_1.Op.and]: [
                { receiverId: req.user.id },
                { createdAt: { [sequelize_1.Op.gt]: before } }
            ]
        };
    }
    console.log(where);
    // Find all the user's games with the where condition above
    // If there exists no after and before cursor -> get data if userId = receiverId
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
    const response = yield invitation_1.default.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            receiverId: req.user.id
        },
        order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
        limit: Number(limit) + 1,
        include: [
            {
                model: user_1.default,
                as: 'sender',
                attributes: { exclude: ['password'] }
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
// Router to create the invitation
inviteRouter.post('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId } = req.body;
    const senderId = req.user.id;
    // userA and userB col in invitation table are indexes, it is used to prevent duplicate invitation from users to users
    // We will normalize the senderId and receiverId by using comparison operation
    const [userA, userB] = senderId < receiverId
        ? [senderId, receiverId]
        : [receiverId, senderId];
    // If userA or userB == null -> error
    if (!userA || !userB) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Create the invitation with the index
    const response = yield models_1.default.Invitation.create({ receiverId, senderId, userA, userB });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
// Route to delete the invitation
inviteRouter.delete('/:id', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the invitation based on the id
    const response = yield invitation_1.default.findByPk(req.params.id);
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Check if the user who tried to delete it is the correct user
    if (req.user.id != response.senderId || req.user.id != response.receiverId) {
        res.status(401).json({ error: 'You are not allowed to do this' });
        return;
    }
    // Delete it
    yield response.destroy();
    res.status(204).end();
    return;
}));
exports.default = inviteRouter;
