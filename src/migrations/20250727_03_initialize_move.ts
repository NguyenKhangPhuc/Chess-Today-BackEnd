import { DataTypes, QueryInterface, Sequelize } from "sequelize";


export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('moves', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        game_id: { type: DataTypes.UUID, references: { model: 'games', key: 'id' }, allowNull: false },
        player_1_move: { type: DataTypes.TEXT, allowNull: false },
        player_2_move: { type: DataTypes.TEXT, allowNull: false },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('moves');
}