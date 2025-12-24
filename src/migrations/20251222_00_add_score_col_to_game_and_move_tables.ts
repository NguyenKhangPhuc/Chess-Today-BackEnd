import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('games', 'latest_score', {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    });
    await queryInterface.addColumn('moves', 'move_score', {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('games', 'latest_score');
    await queryInterface.removeColumn('moves', 'move_score');
}