import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('games', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        player_1_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        player_2_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        winner_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
        ended_at: { type: DataTypes.DATE, },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('games');
}
