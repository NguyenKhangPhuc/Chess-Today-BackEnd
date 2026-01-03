"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameEmitter = void 0;
class GameEmitter {
    emitBoardStateChange(io, game, opponentSocketId) {
        io.to(opponentSocketId).emit('board_state_change', game);
    }
}
exports.gameEmitter = new GameEmitter();
