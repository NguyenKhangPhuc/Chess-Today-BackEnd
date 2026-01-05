import { Server, Socket } from "socket.io";
import { gameQueue } from "../state/matchQueue";
import { gameService } from "../service/gameService";
import { matchMakingEmitter } from "../emitter/matchmaking.emitter";
import { GAME_TYPE } from "../../types/enum";
import { Player, UserAttributes } from "../../types/user";

export function registerMatchMakingHandlers(io: Server, socket: Socket) {
    // When user join the queue to have match making
    socket.on('join_queue', async (user: UserAttributes, timeSetting: { title: string, value: number, mode: GAME_TYPE }) => {
        // Get the users
        const player: Player = { ...user, time: timeSetting.value };
        if (!socket.user) {
            socket.emit('socket_error', { error: 'Not authenticated', listener: 'join_queue' });
            return;
        }
        // Find the other best match player
        const bestMatch = await gameQueue.matchMaking(player, timeSetting.mode);
        // If there exists -> create the match and emit it to both user
        if (bestMatch) {
            const match = await gameService.createMatch(player.id, bestMatch.id, player.time, bestMatch.time, timeSetting.mode);

            matchMakingEmitter.emitMatchFound(io, match);
        }
    });

    // When user want to exit the queue
    socket.on('exit_queue', (timeSetting: { title: string, value: number, mode: GAME_TYPE }) => {
        if (!socket.user) {
            socket.emit('socket_error', { error: 'Not authenticated', listener: 'exit_queue' });
            return;
        }
        const userId = socket.user?.id;
        // Exit the user from the queue
        gameQueue.exitQueue(userId, timeSetting.mode);
        socket.emit('exit_queue', 'Exit successfully');
    });
}