"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class FriendShip extends sequelize_1.Model {
}
FriendShip.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    friendId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'friendship'
});
exports.default = FriendShip;
