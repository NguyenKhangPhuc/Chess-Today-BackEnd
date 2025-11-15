import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { ChallengeAttributes, GAME_TYPE, INVITATION_STATUS } from "../types/types";
type ChallengeCreationAttribute = Optional<ChallengeAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
class Challenge extends Model<ChallengeAttributes, ChallengeCreationAttribute> implements ChallengeAttributes {
    id!: string;
    senderId!: string;
    receiverId!: string;
    status!: INVITATION_STATUS;
    gameType!: GAME_TYPE;
    playerTime!: number;
    isSenderPlayer1!: boolean;
    createdAt?: string;
    updatedAt?: string;
}
Challenge.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    receiverId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending', allowNull: false },
    gameType: { type: DataTypes.ENUM('Blitz', 'Rocket', 'Rapid'), allowNull: false, defaultValue: 'Rapid' },
    playerTime: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 800 },
    isSenderPlayer1: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'challenges',
});

export default Challenge;