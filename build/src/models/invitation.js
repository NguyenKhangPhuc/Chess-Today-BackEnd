"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class Invitation extends sequelize_1.Model {
}
Invitation.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    receiverId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' },
    userA: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    userB: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'invitation'
});
exports.default = Invitation;
