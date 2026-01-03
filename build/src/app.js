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
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('express-async-errors');
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const analyze_1 = __importDefault(require("./routes/analyze"));
const signup_1 = __importDefault(require("./routes/signup"));
const db_1 = require("./utils/db");
const login_1 = __importDefault(require("./routes/login"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const sockets_1 = require("./sockets");
const invite_1 = __importDefault(require("./routes/invite"));
const friendship_1 = __importDefault(require("./routes/friendship"));
const game_1 = __importDefault(require("./routes/game"));
const move_1 = __importDefault(require("./routes/move"));
const middleware_1 = require("./utils/middleware");
const user_1 = __importDefault(require("./routes/user"));
const gameMessage_1 = __importDefault(require("./routes/gameMessage"));
const chatbox_1 = __importDefault(require("./routes/chatbox"));
const message_1 = __importDefault(require("./routes/message"));
const puzzles_1 = __importDefault(require("./routes/puzzles"));
const puzzleMoves_1 = __importDefault(require("./routes/puzzleMoves"));
const userPuzzles_1 = __importDefault(require("./routes/userPuzzles"));
const challenges_1 = __importDefault(require("./routes/challenges"));
const logout_1 = __importDefault(require("./routes/logout"));
const verification_1 = __importDefault(require("./routes/verification"));
const app = (0, express_1.default)();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = http_1.default.createServer(app);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    },
});
// Wrap async middleware for socket.io
// Wrap async socket middleware to handle errors properly
io.use((socket, next) => {
    Promise.resolve((0, middleware_1.socketTokenExtractor)(socket, next)).catch(next);
});
(0, sockets_1.setUpSocket)(io);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectToDB)();
    }
    catch (error) {
        console.log(error);
    }
});
start().then(() => { }).catch(() => console.log('Cannot connect to DB and run Migration'));
app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.use('/api/analyze', analyze_1.default);
app.use('/api/sign-up', signup_1.default);
app.use('/api/login', login_1.default);
app.use('/api/invite', invite_1.default);
app.use('/api/friendship', friendship_1.default);
app.use('/api/game', game_1.default);
app.use('/api/move', move_1.default);
app.use('/api/user', user_1.default);
app.use('/api/game-messages', gameMessage_1.default);
app.use('/api/chatbox', chatbox_1.default);
app.use('/api/message', message_1.default);
app.use('/api/puzzles', puzzles_1.default);
app.use('/api/puzzle-moves', puzzleMoves_1.default);
app.use('/api/user-puzzle', userPuzzles_1.default);
app.use('/api/challenge', challenges_1.default);
app.use('/api/logout', logout_1.default);
app.use('/api/verification', verification_1.default);
app.use(middleware_1.errorHandler);
app.use(middleware_1.unknownEndpoint);
exports.default = server;
