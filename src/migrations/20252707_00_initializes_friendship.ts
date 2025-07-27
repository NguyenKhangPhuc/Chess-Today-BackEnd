import { DataTypes, QueryInterface } from "sequelize";


export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('friendships', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },
        friend_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('friendships');
}