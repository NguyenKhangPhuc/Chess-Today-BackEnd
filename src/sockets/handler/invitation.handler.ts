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

    socket.on('accept_invitation', (payload: { receiver: TokenAttributes, senderId: string }) => {
        // Get the sender and receiverId
        const { receiver, senderId } = payload;
        // Get the sender socket id and emit to it about the invitation
        const senderSocketId = onlineUsers.getSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit('accept_invitation', receiver);
        }
    });

    socket.on('decline_invitation', (payload: { userDelete: TokenAttributes, userReceiveId: string }) => {
        const { userDelete, userReceiveId } = payload;
        // Get the sender socket id and emit to it about the invitation
        const senderSocketId = onlineUsers.getSocketId(userReceiveId);
        if (senderSocketId) {
            io.to(senderSocketId).emit('decline_invitation', userDelete);
        }
    });
}