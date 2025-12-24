import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { MoveAttributes } from "../types/types";

type MoveCreationAttributes = Optional<MoveAttributes, 'id' | 'moveScore'>;
class Move extends Model<MoveAttributes, MoveCreationAttributes> implements MoveAttributes {
    id!: string;
    gameId!: string;
    before!: string;
    after!: string;
    color!: string;
    piece!: string;
    from!: string;
    to!: string;
    san!: string;
    lan!: string;
    promotion?: string | undefined;
    playerTimeLeft!: number;
    moverId!: string;
    moveScore!: number;
}
Move.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    gameId: { type: DataTypes.UUID, references: { model: 'games', key: 'id' }, allowNull: false },
    before: { type: DataTypes.TEXT, allowNull: false },
    after: { type: DataTypes.TEXT, allowNull: false },
    color: { type: DataTypes.TEXT, allowNull: false },
    piece: { type: DataTypes.TEXT, allowNull: false },
    from: { type: DataTypes.TEXT, allowNull: false },
    to: { type: DataTypes.TEXT, allowNull: false },
    san: { type: DataTypes.TEXT, allowNull: false },
    lan: { type: DataTypes.TEXT, allowNull: false },
    promotion: { type: DataTypes.TEXT, allowNull: true },
    playerTimeLeft: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 600 },
    moverId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    moveScore: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'move'
});

export default Move;