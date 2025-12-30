import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { PUZZLE_LEVEL } from "../types/enum";
import { PuzzleAttributes } from "../types/puzzles";

type PuzzleCreationAttributes = Optional<PuzzleAttributes, 'id'>;
class Puzzle extends Model<PuzzleAttributes, PuzzleCreationAttributes> implements PuzzleAttributes {
    id!: string;
    fen!: string;
    title!: string;
    difficulty!: PUZZLE_LEVEL;
    createdAt?: string;
    updatedAt?: string;
}
Puzzle.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fen: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    difficulty: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 3 } },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'puzzle'
});

export default Puzzle;