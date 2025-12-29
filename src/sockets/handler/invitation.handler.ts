import { Server, Socket } from "socket.io";
import { TokenAttributes } from "../../types/types";
import { onlineUsers } from "../state/onlineUsers";

export function registerInvitationHandler(io: Server, socket: Socket) {
    socket.on('new_invitations', (payload: { sender: TokenAttributes, receiverId: string }) => {
        const { sender, receiverId } = payload;

        console.log('New invitation:', sender, receiverId);
        const receiverSocketId = onlineUsers.getSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_invitations', sender);
        }
    });
}