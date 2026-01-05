import { Server } from "socket.io";
import { GameAttributes } from "../../types/game";

class GameEmitter {
    emitBoardStateChange(io: Server, game: GameAttributes, opponentSocketId: string) {
        io.to(opponentSocketId).emit('board_state_change', game);
    }

    emitMoveSuccessfully(io: Server, userSocketid: string) {
        io.to(userSocketid).emit('move_successfully', 'Move successfully');
    }
}

export const gameEmitter = new GameEmitter();