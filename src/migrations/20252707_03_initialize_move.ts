import { DataTypes, QueryInterface } from "sequelize";


export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('moves', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        game_id: { type: DataTypes.INTEGER, references: { model: 'games', key: 'id' }, allowNull: false },
        player_1_move: { type: DataTypes.TEXT, allowNull: false },
        player_2_move: { type: DataTypes.TEXT, allowNull: false },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('moves');
}