import { Server, Socket } from "socket.io";
import { onlineUsers } from "../state/onlineUsers";
import { challengePageController } from "../state/challengePageController";
import { gameService } from "../service/gameService";
import { challengeEmitter } from "../emitter/challenge.emitter";
import { ChallengeAttributes } from "../../types/challenge";

export function registerChallengeHandlers(io: Server, socket: Socket) {
    // Route handle challenge announcement
    socket.on('new_challenge', (challenge: ChallengeAttributes) => {
        // Get the challenge receiverSocketId and emit to them about new challenge
        const receiverSocketId = onlineUsers.getSocketId(challenge.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_challenge', challenge);
        }
    });
    // To handle user enter the page
    socket.on('waiting_challenge', async (challenge: ChallengeAttributes) => {
        if (!socket.user) {
            socket.emit('socket_error', { error: 'Not authenticated', listener: 'waiting_challenge' });
            return;
        }
        const userId = socket.user.id;
        // Check if the user who enter this page is either challenge sender or receiver
        if (userId == challenge.senderId || userId == challenge.receiverId) {
            // Store the userId who enter the page
            challengePageController.handleUserEnterChallengePage(userId, challenge);
            // If number of users enter page is currently 2
            if (challengePageController.checkNumberOfUsers(challenge.id!)) {
                // Create a new match base on the challenge attributes and delete both of them from the page
                const whitePlayerId = challenge.isSenderPlayer1 ? challenge.senderId : challenge.receiverId;
                const blackPlayerId = challenge.isSenderPlayer1 ? challenge.receiverId : challenge.senderId;
                const player1SocketId = onlineUsers.getSocketId(whitePlayerId)!;
                const player2SocketId = onlineUsers.getSocketId(blackPlayerId)!;
                challengePageController.deletePage(challenge.id!);
                if (!player1SocketId) {
                    console.log('Error: User out page');
                    challengePageController.deleteUserFromPage(challenge.id!, whitePlayerId);
                    return;
                }
                if (!player2SocketId) {
                    console.log('Error: User out page');
                    challengePageController.deleteUserFromPage(challenge.id!, blackPlayerId);
                    return;
                }
                // Create the match and emit to both users
                const response = await gameService.createMatch(whitePlayerId, blackPlayerId, challenge.playerTime, challenge.playerTime, challenge.gameType);
                challengeEmitter.emitChallenge(io, player1SocketId, player2SocketId, response.id, whitePlayerId, blackPlayerId, challenge.gameType);
            }
        }
    });

    socket.on('leave_challenge', (payload: { challengeId: string }) => {
        if (!socket.user) {
            socket.emit('socket_error', { error: 'Not authenticated', listener: 'leave_challenge' });
            return;
        }
        challengePageController.deleteUserFromPage(payload.challengeId, socket.user.id);
    });
}