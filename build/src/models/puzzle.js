"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class Puzzle extends sequelize_1.Model {
}
Puzzle.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    fen: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    title: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    difficulty: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 3 } },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'puzzle'
});
exports.default = Puzzle;
