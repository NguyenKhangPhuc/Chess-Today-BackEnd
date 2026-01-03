"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInvitationHandler = registerInvitationHandler;
const onlineUsers_1 = require("../state/onlineUsers");
function registerInvitationHandler(io, socket) {
    // To announce the receiver about the new invitation from the sender
    socket.on('new_invitations', (payload) => {
        // Get the sender and receiverId
        const { sender, receiverId } = payload;
        console.log('New invitation:', sender, receiverId);
        // Get the receiver socket id and emit to it about the invitation
        const receiverSocketId = onlineUsers_1.onlineUsers.getSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_invitations', sender);
        }
    });
}
