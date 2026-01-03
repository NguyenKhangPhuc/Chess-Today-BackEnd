"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../utils/middleware");
const logoutRouter = express_1.default.Router();
// Route to logout
logoutRouter.post('/', middleware_1.tokenExtractor, (_, res) => {
    // Remove the token from the cookies
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    });
    res.status(200).json({ message: 'Logged out' });
    return;
});
exports.default = logoutRouter;
