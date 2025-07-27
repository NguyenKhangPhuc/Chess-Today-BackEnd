import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { GameAttributes } from "../types/types";

type GameCreationAttributes = Optional<GameAttributes, 'id' | 'createdAt' | 'endedAt' | 'updatedAt'>;
class Game extends Model<GameAttributes, GameCreationAttributes> { }
Game.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    player1Id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, field: 'player_1_id', allowNull: false },
    player2Id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, field: 'player_2_id', allowNull: false },
    winnerId: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
    endedAt: { type: DataTypes.TIME },
},
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'game'
    }
);

export default Game;