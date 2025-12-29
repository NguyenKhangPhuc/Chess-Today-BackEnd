class OnlineUsers {
    private userToSockets = new Map<string, string>();

    add(userId: string, socketId: string) {
        if (!this.userToSockets.has(userId)) {
            this.userToSockets.set(userId, socketId);
        }
    }

    remove(userId: string) {
        this.userToSockets.delete(userId);
    }

    getSocketId(userId: string) {
        return this.userToSockets.get(userId);
    }

}

export const onlineUsers = new OnlineUsers();