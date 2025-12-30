import { Server, Socket } from "socket.io";
import { onlineUsers } from "../state/onlineUsers";
import { gameService } from "../service/gameService";
import Game from "../../models/game";
import Move from "../../models/move";
import { MoveAttributes } from "../../types/types";
import { gameEmitter } from "../emitter/game.emitter";

export function registerInGameHandlers(io: Server, socket: Socket) {
    // When the state of the chessboard change
    socket.on('board_state_change', async ({ opponentId, roomId, fen, newTimeLeft, newMove }: { opponentId: string, roomId: string, fen: string, newTimeLeft: number, newMove: MoveAttributes }) => {
        if (!socket.user) {
            console.log('Not authenticated');
            return;
        }
        // Get the opponent and user socketId
        const opponentSocketId = onlineUsers.getSocketId(opponentId);
        const currentUserSocketId = onlineUsers.getSocketId(socket.user.id);
        // Find the game by its id
        const game = await Game.findByPk(roomId);

        if (!game) {
            console.log("ERROR: Game not found");
            return;
        };
        // Verify the userId with the game player
        if (socket.user.id != game.player1Id && socket.user.id != game.player2Id) {
            console.log("Incorrect player");
            return;
        };
        try {
            if (socket.user.id === game.player1Id) {
                // Update the game when the player1 move
                const [_, rows] = await gameService.updatePlayerOneMove(newTimeLeft, roomId, fen);
                // Create the new move
                await Move.create(newMove);
                // Get the newly returned value from the game
                console.log("This is response", rows[0].toJSON());
                // Emit to both the player
                if (opponentSocketId && currentUserSocketId) {
                    gameEmitter.emitBoardStateChange(io, rows[0].toJSON(), opponentSocketId, currentUserSocketId);
                }

            } else {
                // Update the game when the player2 move
                const [_, rows] = await gameService.updatePlayerTwoMove(newTimeLeft, roomId, fen);
                // Create the new move
                await Move.create(newMove);
                // Get the newly returned value from the game
                console.log("This is response", rows[0].toJSON());
                // Emit to both the player
                if (opponentSocketId && currentUserSocketId) {
                    gameEmitter.emitBoardStateChange(io, rows[0].toJSON(), opponentSocketId, currentUserSocketId);
                }
            }
        } catch (error) {
            console.log(error);
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