import { Server } from "socket.io";
import { GameAttributes } from "../../types/game";

class GameEmitter {
    emitBoardStateChange(io: Server, game: GameAttributes, opponentSocketId: string) {
        io.to(opponentSocketId).emit('board_state_change', game);
    }

    emitMoveSuccessfully(io: Server, game: GameAttributes, userSocketid: string) {
        io.to(userSocketid).emit('move_successfully', game);
    }
}

export const gameEmitter = new GameEmitter();