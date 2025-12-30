import { Server } from "socket.io";
import { GAME_TYPE } from "../../types/enum";

class ChallengeEmitter {
    emitChallenge(io: Server, player1SocketId: string, player2SocketId: string, gameId: string, whitePlayerId: string, blackPlayerId: string, gameType: GAME_TYPE) {
        io.to(player1SocketId).emit('match_found', { opponent: blackPlayerId, roomId: gameId, type: gameType });
        io.to(player2SocketId).emit('match_found', { opponent: whitePlayerId, roomId: gameId, type: gameType });
    }
}

export const challengeEmitter = new ChallengeEmitter();