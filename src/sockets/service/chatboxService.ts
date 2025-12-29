import ChatBox from "../../models/chatbox";
import Message from "../../models/message";
import User from "../../models/user";

class ChatBoxService {
    findChatBoxById(chatBoxId: string) {
        return ChatBox.findByPk(chatBoxId, {
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Message,
                    as: 'messages'
                }
            ]
        });
    }
}

export const chatBoxService = new ChatBoxService();