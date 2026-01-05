import { Server } from "socket.io";
import { onlineUsers } from "../state/onlineUsers";
import { GameAttributes } from "../../types/game";

class MatchMakingEmitter {
    emitMatchFound(io: Server, match: GameAttributes) {
        const player_1_socketId = onlineUsers.getSocketId(match.player1Id);
        const player_2_socketId = onlineUsers.getSocketId(match.player2Id);
        console.log(onlineUsers.userToSockets);
        if (player_1_socketId) {
            io.to(player_1_socketId).emit('match_found', { opponent: match.player2Id, roomId: match.id, type: match.gameType });
        } else {
            console.log('User 1 not online');
        }
        if (player_2_socketId) {
            io.to(player_2_socketId).emit('match_found', { opponent: match.player1Id, roomId: match.id, type: match.gameType });
        } else {
            console.log('User 2 not online');
        }

    }
}

export const matchMakingEmitter = new MatchMakingEmitter();