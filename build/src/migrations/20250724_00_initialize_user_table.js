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
        yield queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.Sequelize.literal('uuid_generate_v4()'),
            },
            name: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            username: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            password: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            email: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            status: { type: sequelize_1.DataTypes.BOOLEAN },
            online_at: { type: sequelize_1.DataTypes.DATE },
            created_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            updated_at: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        });
    });
}
function down(_a) {
    return __awaiter(this, arguments, void 0, function* ({ context: queryInterface }) {
        yield queryInterface.dropTable('users');
    });
}
