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
        yield queryInterface.addColumn('chat_boxes', 'user_a', {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        });
        yield queryInterface.addColumn('chat_boxes', 'user_b', {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        });
        yield queryInterface.addIndex('chat_boxes', {
            unique: true,
            fields: ['user_a', 'user_b'],
        });
    });
}
function down(_a) {
    return __awaiter(this, arguments, void 0, function* ({ context: queryInterface }) {
        yield queryInterface.addIndex('chat_boxes', ['userA', 'userB'], { unique: true });
    });
}
