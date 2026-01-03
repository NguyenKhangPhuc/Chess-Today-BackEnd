"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class Challenge extends sequelize_1.Model {
}
Challenge.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    receiverId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending', allowNull: false },
    gameType: { type: sequelize_1.DataTypes.ENUM('Blitz', 'Rocket', 'Rapid'), allowNull: false, defaultValue: 'Rapid' },
    playerTime: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 800 },
    isSenderPlayer1: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'challenges',
});
exports.default = Challenge;
