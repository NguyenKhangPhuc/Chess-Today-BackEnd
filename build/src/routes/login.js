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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const models_1 = __importDefault(require("../models"));
const argon2_1 = __importDefault(require("argon2"));
const loginRouter = express_1.default.Router();
// Route to login
loginRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user from the req body
    const receivedUser = req.body;
    // No password -> error
    if (!receivedUser.password) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    // Find the user with the given username
    const foundUser = yield models_1.default.User.findOne({
        where: {
            username: receivedUser.username,
        }
    });
    // If there exists no user with that given username -> wrong credentials
    if (foundUser == null) {
        res.status(400).json({ error: 'Wrong credentials' });
        return;
    }
    // If the user has not verified -> return an error 
    if (foundUser.isVerified == false) {
        res.status(400).json({ error: 'Account not verified', errorCode: 'UNVERIFIED' });
        return;
    }
    // Verify the given password and the hash password from the user found
    const valid = yield argon2_1.default.verify(foundUser.password, receivedUser.password);
    // If it is not valid -> wrong credentials
    if (!valid) {
        res.status(400).json({ error: 'Wrong credentials' });
        return;
    }
    // If it is -> create a token with fields id, username and name.
    const userForToken = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
    };
    // Create the token
    const token = jsonwebtoken_1.default.sign(userForToken, config_1.JWT_SECRET);
    if (!token) {
        res.status(500).json({ error: 'Token generation failed' });
        return;
    }
    // Store the token to the cookies
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
    });
    res.status(200).json({ message: 'Login sucessfully' });
    return;
}));
exports.default = loginRouter;
