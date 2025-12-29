import { Server, Socket } from "socket.io";
import { MessageAttributes } from "../../types/types";
import { onlineUsers } from "../state/onlineUsers";
import { chatBoxService } from "../service/chatboxService";
import Message from "../../models/message";

export function registerMessageHandlers(io: Server, socket: Socket) {
    socket.on('new_message', async (message: MessageAttributes) => {
        console.log('Receive new_message', socket.user);
        if (!socket.user) {
            console.log('Not authenticated');
            return;
        }
        try {
            const response = await Message.create(message);
            console.log(response);
            const chatBox = await chatBoxService.findChatBoxById(response.chatBoxId);
            console.log(chatBox);
            const userSocketId = onlineUsers.getSocketId(socket.user.id);
            const opponentSocketId = onlineUsers.getSocketId(message.receiverId);
            if (!userSocketId) {
                console.log('Missing user id');
                return;
            }
            io.to(userSocketId).emit('new_message', chatBox);
            if (!opponentSocketId) {
                console.log('Missing opponentSocketId');
                return;
            }
            io.to(opponentSocketId).emit('new_messages_outside', socket.user);
            io.to(opponentSocketId).emit('new_message', chatBox);
        } catch (error) {
            console.log(error);
        }
    });
}