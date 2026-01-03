"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
function up(_a) {
    return __awaiter(this, arguments, void 0, function* ({ context: queryInterface }) {
        yield queryInterface.createTable('puzzles', {
            id: { allowNull: false, primaryKey: true, type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.Sequelize.literal('uuid_generate_v4()') },
            fen: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            title: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            difficulty: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 3 } },
            created_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            updated_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        });
        yield queryInterface.createTable('puzzle_moves', {
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.Sequelize.literal('uuid_generate_v4()'), allowNull: false, primaryKey: true },
            puzzle_id: { type: sequelize_1.DataTypes.UUID, references: { model: 'puzzles', key: 'id' }, allowNull: false },
            before: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            after: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            color: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            piece: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            from: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            to: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            san: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            lan: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            promotion: { type: sequelize_1.DataTypes.TEXT },
            created_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            updated_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        });
        yield queryInterface.createTable('users_puzzles', {
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.Sequelize.literal('uuid_generate_v4()'), primaryKey: true },
            user_id: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
            puzzle_id: { type: sequelize_1.DataTypes.UUID, references: { model: 'puzzles', key: 'id' }, allowNull: false },
            status: { type: sequelize_1.DataTypes.ENUM('solved', 'unsolved'), defaultValue: 'solved', allowNull: false },
            attempt: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            created_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            updated_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        });
    });
}
function down(_a) {
    return __awaiter(this, arguments, void 0, function* ({ context: queryInterface }) {
        yield queryInterface.dropTable('puzzles');
        yield queryInterface.dropTable('puzzle_moves');
        yield queryInterface.dropTable('users_puzzles');
    });
}
