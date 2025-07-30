import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('users', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        name: { type: DataTypes.TEXT, allowNull: false },
        username: { type: DataTypes.TEXT, allowNull: false },
        password: { type: DataTypes.TEXT, allowNull: false },
        email: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.BOOLEAN },
        online_at: { type: DataTypes.TIME },
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false },
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('users');
}