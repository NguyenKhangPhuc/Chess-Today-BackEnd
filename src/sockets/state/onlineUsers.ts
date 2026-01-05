class OnlineUsers {
    public userToSockets = new Map<string, string>();
    // To add the user to the online users map
    add(userId: string, socketId: string) {
        if (!this.userToSockets.has(userId)) {
            this.userToSockets.set(userId, socketId);
        }
    }

    // To remove the user from the online users map
    remove(userId: string) {
        this.userToSockets.delete(userId);
    }

    // To get the user socketId based on userId
    getSocketId(userId: string) {
        return this.userToSockets.get(userId);
    }

}

export const onlineUsers = new OnlineUsers();