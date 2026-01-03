"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
const enum_1 = require("../types/enum");
class Verification extends sequelize_1.Model {
}
Verification.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    hashToken: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    expiredAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    type: { type: sequelize_1.DataTypes.ENUM('PASSWORD_RESET', 'AUTHENTICATION'), allowNull: false, defaultValue: enum_1.VERIFICATION_TYPE.AUTHENTICATION }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'Verification',
    tableName: 'verification'
});
exports.default = Verification;
