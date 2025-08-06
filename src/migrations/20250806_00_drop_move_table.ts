import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('moves');
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('moves', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        game_id: { type: DataTypes.UUID, references: { model: 'games', key: 'id' }, allowNull: false },
        player_1_move: { type: DataTypes.TEXT, allowNull: false, field: 'player_1_move' },
        player_2_move: { type: DataTypes.TEXT, allowNull: false, field: 'player_2_move' },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE },
    });
}