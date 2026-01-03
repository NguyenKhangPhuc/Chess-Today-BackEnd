"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class Game extends sequelize_1.Model {
}
Game.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    player1Id: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, field: 'player_1_id', allowNull: false },
    player2Id: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, field: 'player_2_id' },
    winnerId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' } },
    loserId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' } },
    isDraw: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    endedAt: { type: sequelize_1.DataTypes.DATE },
    fen: { type: sequelize_1.DataTypes.TEXT },
    player1LastMoveTime: { type: sequelize_1.DataTypes.DATE, field: 'player_1_last_move_time', allowNull: false, defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP') },
    player2LastMoveTime: { type: sequelize_1.DataTypes.DATE, field: 'player_2_last_move_time', allowNull: false, defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP') },
    player1TimeLeft: { type: sequelize_1.DataTypes.INTEGER, field: 'player_1_time_left', allowNull: false, defaultValue: 600 },
    player2TimeLeft: { type: sequelize_1.DataTypes.INTEGER, field: 'player_2_time_left', allowNull: false, defaultValue: 600 },
    gameType: { type: sequelize_1.DataTypes.ENUM('Rapid', 'Blitz', 'Rocket'), allowNull: false, defaultValue: 'Rapid' },
    gameStatus: { type: sequelize_1.DataTypes.ENUM('finished, playing'), allowNull: false, defaultValue: 'playing' },
    isBotGame: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    latestScore: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'game'
});
exports.default = Game;
