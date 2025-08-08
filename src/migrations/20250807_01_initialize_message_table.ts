import { DataTypes, QueryInterface } from "sequelize";


export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('messages', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        chat_box_id: { type: DataTypes.UUID, references: { model: 'chat_boxes', key: 'id' }, allowNull: false },
        sender_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        receiver_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('messages');
}