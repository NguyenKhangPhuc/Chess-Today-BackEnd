import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { ChatBoxAttributes } from "../types/types";

type ChatBoxCreationAttributes = Optional<ChatBoxAttributes, 'id'>;
class ChatBox extends Model<ChatBoxAttributes, ChatBoxCreationAttributes> implements ChatBoxAttributes {
    id!: string;
    user1Id!: string;
    user2Id!: string;
    createdAt!: Date;
    updatedAt!: Date;
}
ChatBox.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user1Id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, field: 'user_1_id', allowNull: false },
    user2Id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, field: 'user_2_id', allowNull: false },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'chat_box',
});

export default ChatBox;