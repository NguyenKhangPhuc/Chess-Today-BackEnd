import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db";
import { GameAttributes } from "../types/types";

type GameCreationAttributes = Optional<GameAttributes, 'id' | 'createdAt' | 'endedAt' | 'updatedAt' | 'winnerId' | 'fen'>;
class Game extends Model<GameAttributes, GameCreationAttributes> {
    id!: string;
    player1Id!: string;
    player2Id!: string;
    winnerId?: string;
    endedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    fen?: string;
}
Game.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    player1Id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, field: 'player_1_id', allowNull: false },
    player2Id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, field: 'player_2_id', allowNull: false },
    winnerId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
    endedAt: { type: DataTypes.TIME },
    fen: { type: DataTypes.TEXT },
},
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'game'
    }
);

export default Game;