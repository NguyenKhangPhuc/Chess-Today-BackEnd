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
const friendship_1 = __importDefault(require("../models/friendship"));
const user_1 = __importDefault(require("../models/user"));
const pagination_1 = require("../helpers/pagination");
const friendshipRouter = express_1.default.Router();
// Get the relationship of the verified user.
friendshipRouter.get('/user/:id', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Get the query params from the front-end including cursor after - before and limit to take
    const { after, before, limit } = req.query;
    let where = {};
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is either userId or friendId
    // Besides, the value of there created_at field must be less than after cursor (older than the cursor)
    if (after) {
        where = {
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        { userId: req.params.id },
                        { friendId: req.params.id },
                    ]
                },
                { createdAt: { [sequelize_1.Op.lt]: after } }
            ]
        };
    }
    // If there exitst before cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is either userId or friendId
    // Besides, the value of there created_at field must be greater than after cursor (newer than the cursor)
    if (before) {
        where = {
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        { userId: req.params.id },
                        { friendId: req.params.id },
                    ]
                },
                { createdAt: { [sequelize_1.Op.gt]: before } }
            ]
        };
    }
    // Find all the relations with the where condition above
    // If there exists no after and before cursor -> get data if userId = userId or userId = friendId
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
    const response = yield friendship_1.default.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            [sequelize_1.Op.or]: [
                { userId: (_a = req.params) === null || _a === void 0 ? void 0 : _a.id },
                { friendId: (_b = req.params) === null || _b === void 0 ? void 0 : _b.id },
            ]
        },
        order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
        limit: Number(limit) + 1,
        include: [
            {
                model: user_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            },
            {
                model: user_1.default,
                as: 'friend',
                attributes: { exclude: ['password'] }
            }
        ]
    });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    console.log(response);
    // Get the new next/prev cursor and the boolean value which show if there exists next/prev page.
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = (0, pagination_1.PaginationCursor)(response, Number(limit), after, before);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
}));
// Route to create friendship relation with other person
friendshipRouter.post('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the id from the other person from request body
    const { friendId } = req.body;
    // Create the friendship
    const response = yield models_1.default.FriendShip.create({ userId: req.user.id, friendId });
    if (!response) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
// Route to delete the friendship relation with other person
friendshipRouter.delete('/:id', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the friendship by its id from the request params
    const response = yield models_1.default.FriendShip.findByPk(req.params.id);
    if (!response) {
        res.status(401).json({ error: 'Friendship not found' });
        return;
    }
    // Check if the person who delete this friendship is permitted to do it.
    const isCorrectUser = response.userId === req.user.id || response.friendId === req.user.id;
    if (!isCorrectUser) {
        res.status(403).json({ error: 'Incorrect user, action not allowed' });
        return;
    }
    yield response.destroy();
    res.status(204).end();
    return;
}));
exports.default = friendshipRouter;
