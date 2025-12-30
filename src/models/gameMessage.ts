import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { GameMessageAttributes } from "../types/gameMessage";

type GameMessageCreationAttribute = Optional<GameMessageAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class GameMessage extends Model<GameMessageAttributes, GameMessageCreationAttribute> implements GameMessageAttributes {
    id!: string;
    gameId!: string;
    senderId!: string;
    content!: string;
    createdAt!: Date;
    updatedAt!: Date;
}
GameMessage.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    gameId: { type: DataTypes.UUID, references: { model: 'games', key: 'id' }, allowNull: false },
    senderId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }
},
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'game_message'
    }
);

export default GameMessage;