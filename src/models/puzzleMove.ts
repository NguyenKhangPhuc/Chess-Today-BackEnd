import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { PuzzleMoveAttributes } from "../types/puzzleMove";

type PuzzleMoveCreationAttributes = Optional<PuzzleMoveAttributes, 'id' | 'promotion'>;

class PuzzleMove extends Model<PuzzleMoveAttributes, PuzzleMoveCreationAttributes> {
    id!: string;
    before!: string;
    after!: string;
    color!: string;
    piece!: string;
    from!: string;
    to!: string;
    san!: string;
    lan!: string;
    promotion?: string;
    puzzleId!: string;
}
PuzzleMove.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    puzzleId: { type: DataTypes.UUID, references: { model: 'puzzles', key: 'id' }, allowNull: false },
    before: { type: DataTypes.TEXT, allowNull: false },
    after: { type: DataTypes.TEXT, allowNull: false },
    color: { type: DataTypes.TEXT, allowNull: false },
    piece: { type: DataTypes.TEXT, allowNull: false },
    from: { type: DataTypes.TEXT, allowNull: false },
    to: { type: DataTypes.TEXT, allowNull: false },
    san: { type: DataTypes.TEXT, allowNull: false },
    lan: { type: DataTypes.TEXT, allowNull: false },
    promotion: { type: DataTypes.TEXT },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'PuzzleMove'
});

export default PuzzleMove;