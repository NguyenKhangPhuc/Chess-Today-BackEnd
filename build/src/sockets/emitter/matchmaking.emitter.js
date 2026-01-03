"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchMakingEmitter = void 0;
const onlineUsers_1 = require("../state/onlineUsers");
class MatchMakingEmitter {
    emitMatchFound(io, match) {
        const player_1_socketId = onlineUsers_1.onlineUsers.getSocketId(match.player1Id);
        const player_2_socketId = onlineUsers_1.onlineUsers.getSocketId(match.player2Id);
        if (!player_1_socketId || !player_2_socketId) {
            console.log('Error!!!!! User not online');
            return;
        }
        io.to(player_1_socketId).emit('match_found', { opponent: match.player2Id, roomId: match.id, type: match.gameType });
        io.to(player_2_socketId).emit('match_found', { opponent: match.player1Id, roomId: match.id, type: match.gameType });
    }
}
exports.matchMakingEmitter = new MatchMakingEmitter();
