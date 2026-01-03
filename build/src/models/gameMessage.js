"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class GameMessage extends sequelize_1.Model {
}
GameMessage.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    gameId: { type: sequelize_1.DataTypes.UUID, references: { model: 'games', key: 'id' }, allowNull: false },
    senderId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'game_message'
});
exports.default = GameMessage;
