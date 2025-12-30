import { Server } from "socket.io";
import { onlineUsers } from "../state/onlineUsers";
import { TokenAttributes } from "../../types/types";
import { ChatBoxAttributes } from "../../types/chatbox";


class MessageEmitter {
    emitNewMessage(io: Server, sender: TokenAttributes, receiverId: string, chatBox: ChatBoxAttributes | null) {
        const userSocketId = onlineUsers.getSocketId(sender.id);
        const opponentSocketId = onlineUsers.getSocketId(receiverId);
        if (!userSocketId) {
            console.log('Missing user id');
            return;
        }
        io.to(userSocketId).emit('new_message', chatBox);
        if (!opponentSocketId) {
            console.log('Missing opponentSocketId');
            return;
        }
        io.to(opponentSocketId).emit('new_messages_outside', sender);
        io.to(opponentSocketId).emit('new_message', chatBox);
    }
}

export const messageEmitter = new MessageEmitter();