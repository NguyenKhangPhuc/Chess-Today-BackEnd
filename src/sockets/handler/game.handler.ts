import { Server, Socket } from "socket.io";
import { onlineUsers } from "../state/onlineUsers";
import { gameService } from "../service/gameService";
import Game from "../../models/game";
import Move from "../../models/move";
import { gameEmitter } from "../emitter/game.emitter";
import { MoveAttributes } from "../../types/move";

export function registerInGameHandlers(io: Server, socket: Socket) {
    // When the state of the chessboard change
    socket.on('board_state_change', async ({ opponentId, roomId, fen, newTimeLeft, newMove }: { opponentId: string, roomId: string, fen: string, newTimeLeft: number, newMove: MoveAttributes }) => {
        if (!socket.user) {
            socket.emit('socket_error', { error: 'Not authenticated', listener: 'board_state_change' });
            return;
        }
        // Get the opponent and user socketId
        const opponentSocketId = onlineUsers.getSocketId(opponentId);
        const userSocketId = onlineUsers.getSocketId(socket.user.id);
        // Find the game by its id
        const game = await Game.findByPk(roomId);

        if (!game) {
            socket.emit('socket_error', { error: 'Game not found', listener: 'board_state_change' });
            return;
        };
        // Verify the userId with the game player
        if (socket.user.id != game.player1Id && socket.user.id != game.player2Id) {
            socket.emit('socket_error', { error: 'Userid not match', listener: 'board_state_change' });
            return;
        };
        try {
            if (socket.user.id === game.player1Id) {
                // Update the game when the player1 move
                const [_, rows] = await gameService.updatePlayerOneMove(newTimeLeft, roomId, fen);
                // Create the new move
                await Move.create(newMove);
                // Get the newly returned value from the game

                // Emit to both the player
                if (opponentSocketId) {
                    gameEmitter.emitBoardStateChange(io, rows[0].toJSON(), opponentSocketId);
                }

                if (userSocketId) {
                    gameEmitter.emitMoveSuccessfully(io, userSocketId);
                }

            } else {
                // Update the game when the player2 move
                const [_, rows] = await gameService.updatePlayerTwoMove(newTimeLeft, roomId, fen);
                // Create the new move
                await Move.create(newMove);
                // Get the newly returned value from the game

                // Emit to both the player
                if (opponentSocketId) {
                    gameEmitter.emitBoardStateChange(io, rows[0].toJSON(), opponentSocketId);
                }
                if (userSocketId) {
                    gameEmitter.emitMoveSuccessfully(io, userSocketId);
                }
            }
        } catch (error) {
            socket.emit('socket_error', { error: error, listener: 'board_state_change' });
            return;
        }
    });

    // To announce new in-game message
    socket.on('announce_new_message', (opponentId: string) => {
        // Get the opponentId and announce them that there exists new message
        const opponentSocketId = onlineUsers.getSocketId(opponentId);
        if (opponentSocketId) {
            io.to(opponentSocketId).emit('announce_new_message', 'new message from your opponent');
        }
    });
}