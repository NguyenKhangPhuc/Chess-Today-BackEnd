"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatBoxService = void 0;
const chatbox_1 = __importDefault(require("../../models/chatbox"));
const message_1 = __importDefault(require("../../models/message"));
const user_1 = __importDefault(require("../../models/user"));
class ChatBoxService {
    // To find the chatBox by its id and including also other foreign key
    findChatBoxById(chatBoxId) {
        return chatbox_1.default.findByPk(chatBoxId, {
            include: [
                {
                    model: user_1.default,
                    as: 'user1',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: user_1.default,
                    as: 'user2',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: message_1.default,
                    as: 'messages'
                }
            ]
        });
    }
}
exports.chatBoxService = new ChatBoxService();
