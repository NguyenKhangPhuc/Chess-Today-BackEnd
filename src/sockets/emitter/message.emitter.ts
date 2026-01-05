import { Server } from "socket.io";
import { onlineUsers } from "../state/onlineUsers";
import { TokenAttributes } from "../../types/types";
import { ChatBoxAttributes } from "../../types/chatbox";


class MessageEmitter {
    emitNewMessage(io: Server, sender: TokenAttributes, receiverId: string, chatBox: ChatBoxAttributes | null) {
        const userSocketId = onlineUsers.getSocketId(sender.id);
        const opponentSocketId = onlineUsers.getSocketId(receiverId);
        if (userSocketId) {
            io.to(userSocketId).emit('new_message', chatBox);
            console.log('Missing user id');

        } else {
            console.log('Missing user id');
        }

        if (opponentSocketId) {
            io.to(opponentSocketId).emit('new_messages_outside', sender);
            io.to(opponentSocketId).emit('new_message', chatBox);

        } else {
            console.log('Missing opponentSocketId');
        }

    }
}

export const messageEmitter = new MessageEmitter();