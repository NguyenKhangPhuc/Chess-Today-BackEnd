import { Server, Socket } from "socket.io";

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
    });
};

