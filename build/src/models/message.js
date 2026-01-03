"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class Message extends sequelize_1.Model {
}
Message.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    chatBoxId: { type: sequelize_1.DataTypes.UUID, references: { model: 'chat_boxes', key: 'id' }, field: 'chat_box_id', allowNull: false },
    senderId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    receiverId: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'message'
});
exports.default = Message;
