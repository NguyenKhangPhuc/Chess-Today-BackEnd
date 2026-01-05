import { Server, Socket } from "socket.io";
import { onlineUsers } from "../state/onlineUsers";
import { chatBoxService } from "../service/chatboxService";
import Message from "../../models/message";
import { MessageAttributes } from "../../types/message";

export function registerMessageHandlers(io: Server, socket: Socket) {
    // To announce the receiver user about new message
    socket.on('new_message', async (message: MessageAttributes) => {
        if (!socket.user) {
            socket.emit('socket_error', { error: 'Not authenticated', listener: 'new_message' });
            return;
        }
        try {
            // Create the message
            const response = await Message.create(message);
            // Find the chatBox by its id
            const chatBox = await chatBoxService.findChatBoxById(response.chatBoxId);
            // Get the user1 and user2 socket id
            const userSocketId = onlineUsers.getSocketId(socket.user.id);
            const opponentSocketId = onlineUsers.getSocketId(message.receiverId);
            if (userSocketId) {
                io.to(userSocketId).emit('new_message', chatBox);
            } else {
                console.log('Missing user id');
            }
            // Announce to user1

            if (opponentSocketId) {

                io.to(opponentSocketId).emit('new_messages_outside', socket.user);
                io.to(opponentSocketId).emit('new_message', chatBox);
            } else {
                console.log('Missing opponentSocketId');
            }
            // Announce to user2
        } catch (error) {
            socket.emit('socket_error', { error, listener: 'board_state_change' });
            return;
        }
    });
}