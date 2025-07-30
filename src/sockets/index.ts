import { Server, Socket } from "socket.io";
import { Player, TokenAttributes } from "../types/types";
import Game from "../models/game";


const userIdToSocketIdMap = new Map<string, string>();
const chessQueue: Array<Player> = [];
const xiangqiQueue: Array<Player> = [];


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
        socket.on('join_queue', async (type: string) => {
            if (!socket.user) {
                console.log('User not authenticated');
                return;
            }
            console.log(`${socket.user?.id} join queue`);
            if (socket.user?.id != undefined) {
                if (type == 'Chess') {
                    chessQueue.push({ id: socket.user?.id });
                } else if (type == 'Xiangqi') {
                    xiangqiQueue.push({ id: socket.user?.id });
                }

            } console.log(type);
            console.log('chessQueue', chessQueue);
            console.log('xiangqiQueue', xiangqiQueue);
            await matchMaking(type);
        });

        socket.on('board_state_change', async ({ opponentId, roomId, fen }: { opponentId: string, roomId: string, fen: string }) => {
            await Game.update({ fen: fen }, { where: { id: roomId } });
            const opponentSocketId = userIdToSocketIdMap.get(opponentId);

            if (!opponentSocketId) {
                console.log('Cannot find opponent socket id');
                return;
            }
            io.to(opponentSocketId).emit('board_state_change', fen);

        });



        const matchMaking = async (type: string) => {
            if (type == 'Chess') {
                if (chessQueue.length < 2) {
                    return;
                }
                const player1: Player = chessQueue.shift()!;
                const player2: Player = chessQueue.shift()!;

                const response = await Game.create({
                    player1Id: player1.id,
                    player2Id: player2.id,
                });

                const player_1_socketId = userIdToSocketIdMap.get(player1.id);
                const player_2_socketId = userIdToSocketIdMap.get(player2.id);
                if (!player_1_socketId || !player_2_socketId) {
                    console.log('One of the players is not connected');
                    return;
                }
                io.to(player_1_socketId).emit('match_found', { opponent: player2.id, roomId: response.id, type });
                io.to(player_2_socketId).emit('match_found', { opponent: player1.id, roomId: response.id, type });


                await io.sockets.sockets.get(player_1_socketId)?.join(response.id);
                await io.sockets.sockets.get(player_2_socketId)?.join(response.id);
                console.log(io.sockets.sockets.get(player_1_socketId)?.rooms);
                console.log(io.sockets.sockets.get(player_2_socketId)?.rooms);
            } else if (type == 'Xiangqi') {
                if (xiangqiQueue.length < 2) {
                    return;
                }
                const player1: Player = xiangqiQueue.shift()!;
                const player2: Player = xiangqiQueue.shift()!;

                const response = await Game.create({
                    player1Id: player1.id,
                    player2Id: player2.id,
                });

                const player_1_socketId = userIdToSocketIdMap.get(player1.id);
                const player_2_socketId = userIdToSocketIdMap.get(player2.id);
                if (!player_1_socketId || !player_2_socketId) {
                    console.log('One of the players is not connected');
                    return;
                }
                io.to(player_1_socketId).emit('match_found', { opponent: player2.id, roomId: response.id, type });
                io.to(player_2_socketId).emit('match_found', { opponent: player1.id, roomId: response.id, type });


                await io.sockets.sockets.get(player_1_socketId)?.join(response.id);
                await io.sockets.sockets.get(player_2_socketId)?.join(response.id);
                console.log(io.sockets.sockets.get(player_1_socketId)?.rooms);
                console.log(io.sockets.sockets.get(player_2_socketId)?.rooms);
            }
        };
    });
};