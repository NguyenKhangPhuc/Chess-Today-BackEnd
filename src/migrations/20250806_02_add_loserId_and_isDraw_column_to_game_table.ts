import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('games', 'loser_id', {
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
    });
    await queryInterface.addColumn('games', 'is_draw', {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('games', 'loser_id');
    await queryInterface.removeColumn('games', 'is_draw');
}