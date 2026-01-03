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
        yield queryInterface.addColumn('users', 'rocket_elo', {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 800
        });
        yield queryInterface.addColumn('users', 'blitz_elo', {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 800
        });
    });
}
function down(_a) {
    return __awaiter(this, arguments, void 0, function* ({ context: queryInterface }) {
        yield queryInterface.removeColumn('users', 'rocket_elo');
        yield queryInterface.removeColumn('users', 'blitz_elo');
    });
}
