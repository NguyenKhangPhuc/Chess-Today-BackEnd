"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class ChatBox extends sequelize_1.Model {
}
ChatBox.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    user1Id: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, field: 'user_1_id', allowNull: false },
    user2Id: { type: sequelize_1.DataTypes.UUID, references: { model: 'users', key: 'id' }, field: 'user_2_id', allowNull: false },
    userA: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    userB: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'chat_box',
});
exports.default = ChatBox;
