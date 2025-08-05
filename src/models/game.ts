import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../utils/db";
import { GameAttributes } from "../types/types";

type GameCreationAttributes = Optional<GameAttributes,
    'id' | 'createdAt' | 'endedAt' | 'updatedAt' | 'winnerId' | 'fen' | 'player1LastMoveTime' |
    'player2LastMoveTime' | 'player1TimeLeft' | 'player2TimeLeft'
>;
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
    endedAt: { type: DataTypes.DATE },
    fen: { type: DataTypes.TEXT },
    player1LastMoveTime: { type: DataTypes.DATE, field: 'player_1_last_move_time', allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    player2LastMoveTime: { type: DataTypes.DATE, field: 'player_2_last_move_time', allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    player1TimeLeft: { type: DataTypes.INTEGER, field: 'player_1_time_left', allowNull: false, defaultValue: 600 },
    player2TimeLeft: { type: DataTypes.INTEGER, field: 'player_2_time_left', allowNull: false, defaultValue: 600 },
},
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'game'
    }
);

export default Game;