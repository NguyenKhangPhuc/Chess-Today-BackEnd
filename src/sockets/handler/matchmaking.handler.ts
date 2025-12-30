import { Server, Socket } from "socket.io";
import { GAME_TYPE, Player, UserAttributes } from "../../types/types";
import { gameQueue } from "../state/matchQueue";
import { gameService } from "../service/gameService";
import { matchMakingEmitter } from "../emitter/matchmaking.emitter";

export function registerMatchMakingHandlers(io: Server, socket: Socket) {
    socket.on('join_queue', async (user: UserAttributes, timeSetting: { title: string, value: number, mode: GAME_TYPE }) => {
        const player: Player = { ...user, time: timeSetting.value };
        if (!socket.user) {
            console.log('User not authenticated');
            return;
        }


        const bestMatch = await gameQueue.matchMaking(player, timeSetting.mode);

        if (bestMatch) {
            const match = await gameService.createMatch(player.id, bestMatch.id, player.time, bestMatch.time, timeSetting.mode);

            matchMakingEmitter.emitMatchFound(io, match);
        }
    });

    socket.on('exit_queue', (timeSetting: { title: string, value: number, mode: GAME_TYPE }) => {
        const userId = socket.user?.id;
        if (!userId) {
            console.log('ERROR: Unauthenticated');
            return;
        }
        gameQueue.exitQueue(userId, timeSetting.mode);
        socket.emit('exit_queue', 'Exit successfully');
    });
}