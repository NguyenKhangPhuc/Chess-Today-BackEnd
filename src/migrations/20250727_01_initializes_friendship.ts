import { DataTypes, QueryInterface, Sequelize } from "sequelize";


export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('friendships', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        user_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        friend_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('friendships');
}