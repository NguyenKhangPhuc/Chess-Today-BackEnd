"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageEmitter = void 0;
const onlineUsers_1 = require("../state/onlineUsers");
class MessageEmitter {
    emitNewMessage(io, sender, receiverId, chatBox) {
        const userSocketId = onlineUsers_1.onlineUsers.getSocketId(sender.id);
        const opponentSocketId = onlineUsers_1.onlineUsers.getSocketId(receiverId);
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
exports.messageEmitter = new MessageEmitter();
