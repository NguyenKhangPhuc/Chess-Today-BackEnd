import { Server, Socket } from "socket.io";
import { Player } from "../types/types";

const waitingQueue: Array<Player> = [];
const gameRecord = {
    player1: { id: '', color: 'w' },
    player2: { id: '', color: 'b' }
};
export const setUpSocket = (io: Server) => {
    io.on('connect', (socket: Socket) => {
        console.log('CLient connected');
        socket.on('chat', (msg: string) => {
            console.log('Received:', msg);
            io.emit('chat', msg); // gửi lại tất cả client
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
        socket.on('join_queue', async (socketId: string) => {
            console.log(`${socketId} join queue`);
            if (socketId != undefined) {
                waitingQueue.push({ socketId });
                await matchMaking();
            }
        });

        socket.on('board_state_change', ({ roomId, fen }: { roomId: string, fen: string }) => {
            console.log('broadcasting new fen:', fen);
            io.to(roomId).emit('board_state_change', fen);
        });

        socket.on('game', (roomId: { player1: string, player2: string }) => {
            gameRecord.player1.id = roomId.player1;
            gameRecord.player2.id = roomId.player2;
            socket.emit('game', gameRecord);
        });

        const matchMaking = async () => {
            if (waitingQueue.length < 2) {
                return;
            }
            const player1: Player = waitingQueue.shift()!;
            const player2: Player = waitingQueue.shift()!;

            const roomId = `${player1.socketId}-${player2.socketId}`;
            io.to(player1.socketId).emit('match_found', { opponent: player2.socketId, roomId });
            io.to(player2.socketId).emit('match_found', { opponent: player1.socketId, roomId });


            await io.sockets.sockets.get(player1.socketId)?.join(roomId);
            await io.sockets.sockets.get(player2.socketId)?.join(roomId);
            console.log(io.sockets.sockets.get(player1.socketId)?.rooms);
            console.log(io.sockets.sockets.get(player2.socketId)?.rooms);
        };

    });
};