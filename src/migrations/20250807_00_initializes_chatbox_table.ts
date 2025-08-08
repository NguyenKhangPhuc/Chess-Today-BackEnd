import { DataTypes, QueryInterface } from "sequelize";


export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('chat_boxes', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_1_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        user_2_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('chat_boxes');
}