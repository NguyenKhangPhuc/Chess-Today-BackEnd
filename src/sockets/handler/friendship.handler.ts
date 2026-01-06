import { Server, Socket } from "socket.io";
import { TokenAttributes } from "../../types/types";
import { onlineUsers } from "../state/onlineUsers";

export function registerFriendShipHandler(io: Server, socket: Socket) {
    // To announce the receiver about the new invitation from the sender
    socket.on('delete_friend', (payload: { user: TokenAttributes, userDeletedId: string }) => {
        // Get the sender and receiverId
        const { user, userDeletedId } = payload;
        // Get the receiver socket id and emit to it about the invitation
        const userDeletedSocketId = onlineUsers.getSocketId(userDeletedId);
        if (userDeletedSocketId) {
            io.to(userDeletedSocketId).emit('delete_friend', user);
        }
    });
}