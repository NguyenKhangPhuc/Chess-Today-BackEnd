import { Server, Socket } from "socket.io";
import { TokenAttributes } from "../../types/types";
import { onlineUsers } from "../state/onlineUsers";

export function registerInvitationHandler(io: Server, socket: Socket) {
    // To announce the receiver about the new invitation from the sender
    socket.on('new_invitations', (payload: { sender: TokenAttributes, receiverId: string }) => {
        // Get the sender and receiverId
        const { sender, receiverId } = payload;

        console.log('New invitation:', sender, receiverId);
        // Get the receiver socket id and emit to it about the invitation
        const receiverSocketId = onlineUsers.getSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_invitations', sender);
        }
    });
}