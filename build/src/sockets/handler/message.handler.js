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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMessageHandlers = registerMessageHandlers;
const onlineUsers_1 = require("../state/onlineUsers");
const chatboxService_1 = require("../service/chatboxService");
const message_1 = __importDefault(require("../../models/message"));
function registerMessageHandlers(io, socket) {
    // To announce the receiver user about new message
    socket.on('new_message', (message) => __awaiter(this, void 0, void 0, function* () {
        console.log('Receive new_message', socket.user);
        if (!socket.user) {
            console.log('Not authenticated');
            return;
        }
        try {
            // Create the message
            const response = yield message_1.default.create(message);
            console.log(response);
            // Find the chatBox by its id
            const chatBox = yield chatboxService_1.chatBoxService.findChatBoxById(response.chatBoxId);
            console.log(chatBox);
            // Get the user1 and user2 socket id
            const userSocketId = onlineUsers_1.onlineUsers.getSocketId(socket.user.id);
            const opponentSocketId = onlineUsers_1.onlineUsers.getSocketId(message.receiverId);
            if (!userSocketId) {
                console.log('Missing user id');
                return;
            }
            // Announce to user1
            io.to(userSocketId).emit('new_message', chatBox);
            if (!opponentSocketId) {
                console.log('Missing opponentSocketId');
                return;
            }
            // Announce to user2
            io.to(opponentSocketId).emit('new_messages_outside', socket.user);
            io.to(opponentSocketId).emit('new_message', chatBox);
        }
        catch (error) {
            console.log(error);
        }
    }));
}
