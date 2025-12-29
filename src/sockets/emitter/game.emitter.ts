import { Server } from "socket.io";
import { GameAttributes } from "../../types/types";

class GameEmitter {
    emitBoardStateChange(io: Server, game: GameAttributes, user1SocketId: string, user2SocketId: string) {
        io.to(user1SocketId).emit('board_state_change', game);
        io.to(user2SocketId).emit('board_state_change', game);
    }
}

export const gameEmitter = new GameEmitter();