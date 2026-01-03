"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const models_1 = __importDefault(require("../models"));
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("../models/user"));
const pagination_1 = require("../helpers/pagination");
const enum_1 = require("../types/enum");
const argon2 = __importStar(require("argon2"));
const verification_1 = __importDefault(require("../models/verification"));
const verification_2 = require("../helpers/verification");
const game_1 = __importDefault(require("../models/game"));
const userRouter = express_1.default.Router();
// Route to check if the user is verified and return
userRouter.get('/check', middleware_1.tokenExtractor, (req, res) => {
    var _a;
    // Return the user basic info if exists
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) {
        res.status(200).json({ userInfo: req.user });
    }
    else {
        res.status(401).json({ error: 'Not authenticated' });
    }
    return;
});
// Route to get all the people who are not the verified user's friends
userRouter.get('/people', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find all the verified user's friends
    const userFriends = yield models_1.default.FriendShip.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { userId: req.user.id },
                { friendId: req.user.id }
            ]
        }
    });
    // Create an array from a set of unique id including friends id and userId
    const excludeIds = Array.from(new Set(userFriends.flatMap((e) => {
        var _a, _b;
        if (e.userId === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return [e.friendId];
        else if (e.friendId === ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id))
            return [e.userId];
        return [];
    })));
    const { limit, after, before } = req.query;
    let where = {};
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is not from the id from the excludedIds array, including the user;
    // Besides, the value of there created_at field must be less than after cursor (older than the cursor) and must not be a bot
    if (after) {
        where = {
            [sequelize_1.Op.and]: [
                { createdAt: { [sequelize_1.Op.lt]: after }, },
                { id: { [sequelize_1.Op.notIn]: [...excludeIds] } },
                { isBot: false }
            ]
        };
    }
    // If there exitst after cursor -> we have to set the where conditions of the query to:
    // Get the data where the userId is not from the id from the excludedIds array, including the user;
    // Besides, the value of there created_at field must be greater than after cursor (newer than the cursor) and must not be a bot
    if (before) {
        where = {
            [sequelize_1.Op.and]: [
                { createdAt: { [sequelize_1.Op.gt]: before }, },
                { id: { [sequelize_1.Op.notIn]: [...excludeIds] } },
                { isBot: false }
            ]
        };
    }
    // Find all the user's games with the where condition above
    // If there exists no after and before cursor -> get data where the id is not from the excludeIds and not a bot
    // If there exists no after and before cursor or exists only after cursor -> get data from newest to oldest
    // Else -> get data from oldest to newest
    const response = yield models_1.default.User.findAll({
        where: Object.getOwnPropertySymbols(where).length > 0 ? where : {
            id: { [sequelize_1.Op.notIn]: [...excludeIds] },
            isBot: false
        },
        order: (!after && !before) || after ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']],
        limit: Number(limit) + 1,
        attributes: { exclude: ['password'] },
    });
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    // Get the new next/prev cursor and the boolean value which show if there exists next/prev page.
    const { data, hasNextPage, hasPrevPage, nextCursor, prevCursor } = (0, pagination_1.PaginationCursor)(response, Number(limit), after, before);
    res.status(200).json({ data, hasNextPage, hasPrevPage, nextCursor, prevCursor });
    return;
}));
// Route to get the verified user information
userRouter.get('/', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get the user information based on the userId, including information about friends also
    const response = yield models_1.default.User.findByPk((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, {
        attributes: { exclude: ['password'] },
        include: [
            {
                model: models_1.default.User,
                as: 'friends',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
            {
                model: models_1.default.User,
                as: 'friendOf',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
        ]
    });
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(response);
}));
// Route to get the information of the specific user information based on their id through request params
userRouter.get('/:id', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.params.id, "Params id");
    // Get the specific user information through the req params, including the friends
    const response = yield models_1.default.User.findByPk((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, {
        attributes: { exclude: ['password'] },
        include: [
            {
                model: models_1.default.User,
                as: 'friends',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
            {
                model: models_1.default.User,
                as: 'friendOf',
                through: {
                    attributes: ['id']
                },
                attributes: { exclude: ['password'] }
            },
        ]
    });
    console.log(response);
    if (!response) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(response);
}));
// Route to update the user elo based on the gameType
userRouter.put('/update-elo', middleware_1.tokenExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the game and check its status
    console.log("Update userElo", req.body);
    const game = yield game_1.default.findByPk(req.body.gameId);
    if (!game) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    if (game.gameStatus == enum_1.GAME_STATUS.FINISHED) {
        res.status(409).json({ error: 'Game is already been updated' });
        return;
    }
    // Find the user based on the id from the decoded token
    const user = yield user_1.default.findByPk(req.user.id);
    const opponent = yield user_1.default.findByPk(req.body.opponentId);
    if (!user || !opponent) {
        res.status(401).json({ error: 'User not found' });
        return;
    }
    // Map to map the gameType to the user field
    const fieldMap = {
        [enum_1.GAME_TYPE.ROCKET]: 'rocketElo',
        [enum_1.GAME_TYPE.BLITZ]: 'blitzElo',
        [enum_1.GAME_TYPE.RAPID]: 'elo',
    };
    // Get the suitable field from the gameType
    const fieldToUpdate = fieldMap[req.body.gameType];
    if (!fieldToUpdate) {
        // Return if field is inccorect
        res.status(400).json({ error: 'Game type incorrect' });
        return;
    }
    // Update the suitable field above
    console.log('Update userElo');
    const response = yield user.update({
        [fieldToUpdate]: req.body.userElo
    });
    const opponentResponse = yield opponent.update({ [fieldToUpdate]: req.body.opponentElo });
    if (!response || !opponentResponse) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(response);
    return;
}));
userRouter.put('/update-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, code, oldPass, newPass } = req.body;
    // Find and verify the user password
    const foundUser = yield user_1.default.findOne({ where: { username } });
    if (!foundUser) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const isValid = yield argon2.verify(foundUser.password, oldPass);
    if (!isValid) {
        res.status(401).json({ error: 'Incorrect old password' });
        return;
    }
    // Find and verify the verification code
    const verificationCode = yield verification_1.default.findOne({
        where: { userId: foundUser.id, type: enum_1.VERIFICATION_TYPE.PASSWORD_RESET },
    });
    if (!verificationCode) {
        res.status(404).json({ error: 'Verification code not found' });
        return;
    }
    if (verificationCode.expiredAt < new Date()) {
        res.status(410).json({ error: 'Verification code expired' });
        return;
    }
    if (verificationCode.hashToken !== (0, verification_2.hashToken)(code)) {
        res.status(401).json({ error: 'Invalid verification code' });
        return;
    }
    // Update new password
    const newHashPass = yield argon2.hash(newPass);
    yield foundUser.update({ password: newHashPass });
    res.status(200).json({ message: 'Password updated successfully' });
    return;
}));
exports.default = userRouter;
