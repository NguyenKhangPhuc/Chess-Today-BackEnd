"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class PuzzleMove extends sequelize_1.Model {
}
PuzzleMove.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    puzzleId: { type: sequelize_1.DataTypes.UUID, references: { model: 'puzzles', key: 'id' }, allowNull: false },
    before: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    after: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    color: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    piece: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    from: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    to: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    san: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    lan: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    promotion: { type: sequelize_1.DataTypes.TEXT },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'PuzzleMove'
});
exports.default = PuzzleMove;
