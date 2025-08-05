import { Server, Socket } from "socket.io";
import { TokenAttributes, UserAttributes } from "../types/types";
import Game from "../models/game";
import MatchMakingQueue from "../matchmaking";
import Move from "../models/move";
import models from "../models";


const userIdToSocketIdMap = new Map<string, string>();
const queue = new MatchMakingQueue();


declare module "socket.io" {
    interface Socket {
        user?: TokenAttributes;
    }
}

export const setUpSocket = (io: Server) => {
    io.on('connect', (socket: Socket) => {

        console.log('CLient connected');
        if (socket.user?.id) {
            userIdToSocketIdMap.set(socket.user.id, socket.id);
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);

        });
        socket.on('join_queue', async (type: string, player: UserAttributes) => {
            if (!socket.user) {
                console.log('User not authenticated');
                return;
            }
            console.log(`${socket.user?.id} join queue`);
            if (socket.user?.id != undefined) {
                queue.add(player);
            }
            console.log(type);
            const bestMatch = queue.findMatch(player, 10);
            console.log(queue.playerQueue);
            if (bestMatch) {
                const player_1_socketId = userIdToSocketIdMap.get(player.id);
                const player_2_socketId = userIdToSocketIdMap.get(bestMatch.id);
                if (!player_1_socketId || !player_2_socketId) {
                    console.log('One of the players is not connected');
                    return;
                }
                const response = await Game.create({
                    player1Id: player.id,
                    player2Id: bestMatch.id,
                });
                io.to(player_1_socketId).emit('match_found', { opponent: bestMatch, roomId: response.id, type });
                io.to(player_2_socketId).emit('match_found', { opponent: player.id, roomId: response.id, type });
            }
        });

        socket.on('board_state_change', async ({ opponentId, roomId, fen }: { opponentId: string, roomId: string, fen: string }) => {
            await Game.update({ fen: fen }, { where: { id: roomId } });
            const opponentSocketId = userIdToSocketIdMap.get(opponentId);
            if (!opponentSocketId) {
                console.log('Incorrect opponent');
                return;
            }
            io.to(opponentSocketId).emit('board_state_change', fen);

        });

        socket.on('game_time_update', async ({ newLeftTime, gameId, opponentId }: { newLeftTime: number, gameId: string, opponentId: string }) => {
            if (!socket.user) {
                console.log('User not authenticated');
                return;
            }
            const response = await Game.findByPk(gameId, {
                include: [
                    {
                        model: Move,
                        as: 'moveHistory'
                    },
                    {
                        model: models.User,
                        as: 'player1',
                        attributes: { exclude: ['password'] }
                    },
                    {
                        model: models.User,
                        as: 'player2',
                        attributes: { exclude: ['password'] }
                    }
                ]
            });
            if (!response) {
                console.log('Game not found');
                return;
            }
            const player_1_socketId = userIdToSocketIdMap.get(socket.user.id);
            const player_2_socketId = userIdToSocketIdMap.get(opponentId);
            if (!player_1_socketId || !player_2_socketId) {
                console.log('One of the players is not connected');
                return;
            }
            if (socket.user.id === response.player1Id) {
                const newPlayer1LastMoveTime = new Date();
                const result = await response.update({ player1TimeLeft: newLeftTime, player1LastMoveTime: newPlayer1LastMoveTime });

                io.to(player_1_socketId).emit('game_time_update', result);
                io.to(player_2_socketId).emit('game_time_update', result);
            } else {
                const newPlayer2LastMoveTime = new Date();
                const result = await response.update({ player2TimeLeft: newLeftTime, player2LastMoveTime: newPlayer2LastMoveTime });
                io.to(player_1_socketId).emit('game_time_update', result);
                io.to(player_2_socketId).emit('game_time_update', result);
            }
        });

    });
};