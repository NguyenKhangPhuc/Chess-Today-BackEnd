import { Server, Socket } from "socket.io";
import { onlineUsers } from "../state/onlineUsers";
import { gameService } from "../service/gameService";
import Game from "../../models/game";
import Move from "../../models/move";
import { MoveAttributes } from "../../types/types";
import { gameEmitter } from "../emitter/game.emitter";

export function registerInGameHandlers(io: Server, socket: Socket) {
    socket.on('board_state_change', async ({ opponentId, roomId, fen, newTimeLeft, newMove }: { opponentId: string, roomId: string, fen: string, newTimeLeft: number, newMove: MoveAttributes }) => {
        if (!socket.user) {
            console.log('Not authenticated');
            return;
        }
        const opponentSocketId = onlineUsers.getSocketId(opponentId);
        const currentUserSocketId = onlineUsers.getSocketId(socket.user.id);
        const game = await Game.findByPk(roomId);

        if (!game) {
            console.log("ERROR: Game not found");
            return;
        };
        if (socket.user.id != game.player1Id && socket.user.id != game.player2Id) {
            console.log("Incorrect player");
            return;
        };
        try {
            if (socket.user.id === game.player1Id) {
                const [_, rows] = await gameService.updatePlayerOneMove(newTimeLeft, roomId, fen);
                await Move.create(newMove);
                console.log("This is response", rows[0].toJSON());
                if (opponentSocketId && currentUserSocketId) {
                    gameEmitter.emitBoardStateChange(io, rows[0].toJSON(), opponentSocketId, currentUserSocketId);
                }

            } else {
                const [_, rows] = await gameService.updatePlayerTwoMove(newTimeLeft, roomId, fen);
                await Move.create(newMove);
                console.log("This is response", rows[0].toJSON());
                if (opponentSocketId && currentUserSocketId) {
                    gameEmitter.emitBoardStateChange(io, rows[0].toJSON(), opponentSocketId, currentUserSocketId);
                }
            }
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('announce_new_message', (opponentId: string) => {
        const opponentSocketId = onlineUsers.getSocketId(opponentId);
        if (opponentSocketId) {
            io.to(opponentSocketId).emit('announce_new_message', 'new message from your opponent');
        }
    });
}