import { Socket } from "socket.io";
import User from "../../models/user";
import { onlineUsers } from "../state/onlineUsers";

export async function registerConnectionHandlers(socket: Socket) {
    console.log("User connected", socket.id);

    if (socket.user?.id) {
        onlineUsers.add(socket.user.id, socket.id);
        console.log(socket.user.id, socket.id);
        await User.update({ isOnline: true, onlineAt: new Date() }, { where: { id: socket.user.id } });
    }

    socket.on("disconnect", async () => {
        console.log("Client disconnected:", socket.id);
        if (socket.user?.id) {
            onlineUsers.remove(socket.user.id);
            await User.update({ isOnline: false, onlineAt: new Date() }, { where: { id: socket.user.id } });
        }
    });
}