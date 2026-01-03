"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChallengeHandlers = registerChallengeHandlers;
const onlineUsers_1 = require("../state/onlineUsers");
const challengePageController_1 = require("../state/challengePageController");
const gameService_1 = require("../service/gameService");
const challenge_emitter_1 = require("../emitter/challenge.emitter");
function registerChallengeHandlers(io, socket) {
    // Route handle challenge announcement
    socket.on('new_challenge', (challenge) => {
        // Get the challenge receiverSocketId and emit to them about new challenge
        const receiverSocketId = onlineUsers_1.onlineUsers.getSocketId(challenge.receiverId);
        if (receiverSocketId) {
            console.log('sending challenge');
            io.to(receiverSocketId).emit('new_challenge', challenge);
        }
    });
    // To handle user enter the page
    socket.on('waiting_challenge', (challenge) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.user) {
            console.log('Not authenticated');
            return;
        }
        const userId = socket.user.id;
        // Check if the user who enter this page is either challenge sender or receiver
        if (userId == challenge.senderId || userId == challenge.receiverId) {
            // Store the userId who enter the page
            challengePageController_1.challengePageController.handleUserEnterChallengePage(userId, challenge);
            // If number of users enter page is currently 2
            if (challengePageController_1.challengePageController.checkNumberOfUsers(challenge.id)) {
                // Create a new match base on the challenge attributes and delete both of them from the page
                const whitePlayerId = challenge.isSenderPlayer1 ? challenge.senderId : challenge.receiverId;
                const blackPlayerId = challenge.isSenderPlayer1 ? challenge.receiverId : challenge.senderId;
                const player1SocketId = onlineUsers_1.onlineUsers.getSocketId(whitePlayerId);
                const player2SocketId = onlineUsers_1.onlineUsers.getSocketId(blackPlayerId);
                challengePageController_1.challengePageController.deletePage(challenge.id);
                if (!player1SocketId || !player2SocketId) {
                    console.log('Error: User out page');
                }
                // Create the match and emit to both users
                const response = yield gameService_1.gameService.createMatch(whitePlayerId, blackPlayerId, challenge.playerTime, challenge.playerTime, challenge.gameType);
                challenge_emitter_1.challengeEmitter.emitChallenge(io, player1SocketId, player2SocketId, response.id, whitePlayerId, blackPlayerId, challenge.gameType);
            }
        }
    }));
    socket.on('leave_challenge', (payload) => {
        if (!socket.user) {
            console.log('Not authenticated');
            return;
        }
        console.log('user leave page');
        challengePageController_1.challengePageController.deleteUserFromPage(payload.challengeId, socket.user.id);
    });
}
