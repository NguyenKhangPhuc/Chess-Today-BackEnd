import { Server, Socket } from "socket.io";
import { ChallengeAttributes } from "../../types/types";
import { onlineUsers } from "../state/onlineUsers";
import { challengePageController } from "../state/challengePageController";
import { gameService } from "../service/gameService";
import { challengeEmitter } from "../emitter/challenge.emitter";

export function registerChallengeHandlers(io: Server, socket: Socket) {
    socket.on('new_challenge', (challenge: ChallengeAttributes) => {
        console.log('Challenge', challenge);
        const receiverSocketId = onlineUsers.getSocketId(challenge.receiverId);
        if (receiverSocketId) {
            console.log('sending challenge');
            io.to(receiverSocketId).emit('new_challenge', challenge);
        }
    });
    socket.on('waiting_challenge', async (challenge: ChallengeAttributes) => {
        if (!socket.user) {
            console.log('Not authenticated');
            return;
        }
        const userId = socket.user.id;
        console.log(challenge);
        if (userId == challenge.senderId || userId == challenge.receiverId) {
            challengePageController.handleUserEnterChallengePage(userId, challenge);
            if (challengePageController.checkNumberOfUsers(challenge.id!)) {
                const whitePlayerId = challenge.isSenderPlayer1 ? challenge.senderId : challenge.receiverId;
                const blackPlayerId = challenge.isSenderPlayer1 ? challenge.receiverId : challenge.senderId;
                const player1SocketId = onlineUsers.getSocketId(whitePlayerId)!;
                const player2SocketId = onlineUsers.getSocketId(blackPlayerId)!;
                challengePageController.deletePage(challenge.id!);
                if (!player1SocketId || !player2SocketId) {
                    console.log('Error: User out page');
                }
                const response = await gameService.createMatch(whitePlayerId, blackPlayerId, challenge.playerTime, challenge.playerTime, challenge.gameType);
                challengeEmitter.emitChallenge(io, player1SocketId, player2SocketId, response.id, whitePlayerId, blackPlayerId, challenge.gameType);
            }
        }
    });
}