import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { MessageAttributes } from "../types/types";


type MessageCreationAttributes = Optional<MessageAttributes, 'id'>;
class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    id!: string;
    chatBoxId!: string;
    senderId!: string;
    receiverId!: string;
    content!: string;
    createdAt?: Date;
    updatedAt?: Date;
}
Message.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    chatBoxId: { type: DataTypes.UUID, references: { model: 'chat_boxes', key: 'id' }, field: 'chat_box_id', allowNull: false },
    senderId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    receiverId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }
},
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'message'
    }
);

export default Message;