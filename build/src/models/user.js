"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class User extends sequelize_1.Model {
}
User.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    name: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    username: { type: sequelize_1.DataTypes.TEXT, allowNull: false, validate: { isEmail: { msg: 'Username must be an email' } }, unique: true },
    elo: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 800 },
    rocketElo: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 800 },
    blitzElo: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 800 },
    password: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    status: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    isOnline: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    onlineAt: { type: sequelize_1.DataTypes.DATE },
    isBot: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isVerified: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'User'
});
exports.default = User;
