import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('games', 'is_bot_game', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('games', 'is_bot_game');
}