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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInGameHandlers = registerInGameHandlers;
const onlineUsers_1 = require("../state/onlineUsers");
const gameService_1 = require("../service/gameService");
const game_1 = __importDefault(require("../../models/game"));
const move_1 = __importDefault(require("../../models/move"));
const game_emitter_1 = require("../emitter/game.emitter");
function registerInGameHandlers(io, socket) {
    // When the state of the chessboard change
    socket.on('board_state_change', (_a) => __awaiter(this, [_a], void 0, function* ({ opponentId, roomId, fen, newTimeLeft, newMove }) {
        if (!socket.user) {
            console.log('Not authenticated');
            return;
        }
        // Get the opponent and user socketId
        const opponentSocketId = onlineUsers_1.onlineUsers.getSocketId(opponentId);
        // Find the game by its id
        const game = yield game_1.default.findByPk(roomId);
        if (!game) {
            console.log("ERROR: Game not found");
            return;
        }
        ;
        // Verify the userId with the game player
        if (socket.user.id != game.player1Id && socket.user.id != game.player2Id) {
            console.log("Incorrect player");
            return;
        }
        ;
        try {
            if (socket.user.id === game.player1Id) {
                // Update the game when the player1 move
                const [_, rows] = yield gameService_1.gameService.updatePlayerOneMove(newTimeLeft, roomId, fen);
                // Create the new move
                yield move_1.default.create(newMove);
                // Get the newly returned value from the game
                console.log("This is response", rows[0].toJSON());
                // Emit to both the player
                if (opponentSocketId) {
                    game_emitter_1.gameEmitter.emitBoardStateChange(io, rows[0].toJSON(), opponentSocketId);
                }
            }
            else {
                // Update the game when the player2 move
                const [_, rows] = yield gameService_1.gameService.updatePlayerTwoMove(newTimeLeft, roomId, fen);
                // Create the new move
                yield move_1.default.create(newMove);
                // Get the newly returned value from the game
                console.log("This is response", rows[0].toJSON());
                // Emit to both the player
                if (opponentSocketId) {
                    game_emitter_1.gameEmitter.emitBoardStateChange(io, rows[0].toJSON(), opponentSocketId);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }));
    // To announce new in-game message
    socket.on('announce_new_message', (opponentId) => {
        // Get the opponentId and announce them that there exists new message
        const opponentSocketId = onlineUsers_1.onlineUsers.getSocketId(opponentId);
        if (opponentSocketId) {
            io.to(opponentSocketId).emit('announce_new_message', 'new message from your opponent');
        }
    });
}
