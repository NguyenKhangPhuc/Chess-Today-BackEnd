import { Server } from "socket.io";
import { GameAttributes } from "../../types/types";
import { onlineUsers } from "../state/onlineUsers";

class MatchMakingEmitter {
    emitMatchFound(io: Server, match: GameAttributes) {
        const player_1_socketId = onlineUsers.getSocketId(match.player1Id);
        const player_2_socketId = onlineUsers.getSocketId(match.player2Id);
        if (!player_1_socketId || !player_2_socketId) {
            console.log('Error!!!!! User not online');
            return;
        }
        io.to(player_1_socketId).emit('match_found', { opponent: match.player2Id, roomId: match.id, type: match.gameType });
        io.to(player_2_socketId).emit('match_found', { opponent: match.player1Id, roomId: match.id, type: match.gameType });
    }
}

export const matchMakingEmitter = new MatchMakingEmitter();