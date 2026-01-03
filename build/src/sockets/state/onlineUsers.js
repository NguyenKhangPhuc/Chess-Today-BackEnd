"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineUsers = void 0;
class OnlineUsers {
    constructor() {
        this.userToSockets = new Map();
    }
    // To add the user to the online users map
    add(userId, socketId) {
        if (!this.userToSockets.has(userId)) {
            this.userToSockets.set(userId, socketId);
        }
    }
    // To remove the user from the online users map
    remove(userId) {
        this.userToSockets.delete(userId);
    }
    // To get the user socketId based on userId
    getSocketId(userId) {
        return this.userToSockets.get(userId);
    }
}
exports.onlineUsers = new OnlineUsers();
