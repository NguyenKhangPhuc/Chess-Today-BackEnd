import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { MoveAttributes } from "../types/types";

type MoveCreationAttributes = Optional<MoveAttributes, 'id'>;
class Move extends Model<MoveAttributes, MoveCreationAttributes> { }
Move.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    gameId: { type: DataTypes.UUID, references: { model: 'games', key: 'id' }, allowNull: false },
    player1Move: { type: DataTypes.TEXT, allowNull: false, field: 'player_1_move' },
    player2Move: { type: DataTypes.TEXT, allowNull: false, field: 'player_2_move' },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'move'
});

export default Move;