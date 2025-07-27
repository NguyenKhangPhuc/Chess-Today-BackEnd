import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('games', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        player_1_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },
        player_2_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },
        winner_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },
        ended_at: { type: DataTypes.TIME, },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('games');
}
