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
        yield queryInterface.createTable('invitations', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.Sequelize.literal('uuid_generate_v4()'),
            },
            receiver_id: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
            sender_id: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
            status: { type: sequelize_1.DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' },
            created_at: { type: sequelize_1.DataTypes.DATE },
            updated_at: { type: sequelize_1.DataTypes.DATE }
        });
    });
}
function down(_a) {
    return __awaiter(this, arguments, void 0, function* ({ context: queryInterface }) {
        yield queryInterface.dropTable('invitations');
    });
}
