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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMatchMakingHandlers = registerMatchMakingHandlers;
const matchQueue_1 = require("../state/matchQueue");
const gameService_1 = require("../service/gameService");
const matchmaking_emitter_1 = require("../emitter/matchmaking.emitter");
function registerMatchMakingHandlers(io, socket) {
    // When user join the queue to have match making
    socket.on('join_queue', (user, timeSetting) => __awaiter(this, void 0, void 0, function* () {
        // Get the users
        const player = Object.assign(Object.assign({}, user), { time: timeSetting.value });
        if (!socket.user) {
            console.log('User not authenticated');
            return;
        }
        // Find the other best match player
        const bestMatch = yield matchQueue_1.gameQueue.matchMaking(player, timeSetting.mode);
        // If there exists -> create the match and emit it to both user
        if (bestMatch) {
            const match = yield gameService_1.gameService.createMatch(player.id, bestMatch.id, player.time, bestMatch.time, timeSetting.mode);
            matchmaking_emitter_1.matchMakingEmitter.emitMatchFound(io, match);
        }
    }));
    // When user want to exit the queue
    socket.on('exit_queue', (timeSetting) => {
        var _a;
        const userId = (_a = socket.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            console.log('ERROR: Unauthenticated');
            return;
        }
        // Exit the user from the queue
        matchQueue_1.gameQueue.exitQueue(userId, timeSetting.mode);
        console.log('exit queue');
        socket.emit('exit_queue', 'Exit successfully');
    });
}
