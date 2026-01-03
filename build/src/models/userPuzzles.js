"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class UserPuzzles extends sequelize_1.Model {
}
UserPuzzles.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    puzzleId: { type: sequelize_1.DataTypes.UUID, references: { model: 'puzzles', key: 'id' }, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM('solved', 'unsolved'), defaultValue: 'solved', allowNull: false },
    attempt: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'UserPuzzle',
    tableName: 'users_puzzles'
});
exports.default = UserPuzzles;
