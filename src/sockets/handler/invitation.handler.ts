import { Server, Socket } from "socket.io";
import { onlineUsers } from "../state/onlineUsers";
import { TokenAttributes } from "../../types/types";

export function registerInvitationHandler(io: Server, socket: Socket) {
    // To announce the receiver about the new invitation from the sender
    socket.on('new_invitations', (payload: { sender: TokenAttributes, receiverId: string }) => {
        // Get the sender and receiverId
        const { sender, receiverId } = payload;

        // Get the receiver socket id and emit to it about the invitation
        const receiverSocketId = onlineUsers.getSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_invitations', sender);
        }
    });
}