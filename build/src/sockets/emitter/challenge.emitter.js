"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeEmitter = void 0;
class ChallengeEmitter {
    emitChallenge(io, player1SocketId, player2SocketId, gameId, whitePlayerId, blackPlayerId, gameType) {
        io.to(player1SocketId).emit('match_found', { opponent: blackPlayerId, roomId: gameId, type: gameType });
        io.to(player2SocketId).emit('match_found', { opponent: whitePlayerId, roomId: gameId, type: gameType });
    }
}
exports.challengeEmitter = new ChallengeEmitter();
