import { DataTypes, Model, Optional, } from "sequelize";
import { sequelize } from "../utils/db";
import { PUZZLE_STATUS, UserPuzzleRelationAttribute } from "../types/types";

type UserPuzzleCreationAttributes = Optional<UserPuzzleRelationAttribute, 'id' | 'status'>;
class UserPuzzles extends Model<UserPuzzleCreationAttributes, UserPuzzleRelationAttribute> implements UserPuzzleRelationAttribute {
    id!: string;
    userId!: string;
    puzzleId!: string;
    status!: PUZZLE_STATUS;
    attempt!: number;
    createdAt?: string;
    updatedAt?: string;
}

UserPuzzles.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    puzzleId: { type: DataTypes.UUID, references: { model: 'puzzles', key: 'id' }, allowNull: false },
    status: { type: DataTypes.ENUM('solved', 'unsolved'), defaultValue: 'solved', allowNull: false },
    attempt: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'UserPuzzle',
    tableName: 'users_puzzles'
});

export default UserPuzzles;