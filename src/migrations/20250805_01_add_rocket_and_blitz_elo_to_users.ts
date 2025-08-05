import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('users', 'rocket_elo', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 800
    });
    await queryInterface.addColumn('users', 'blitz_elo', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 800
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('users', 'rocket_elo');
    await queryInterface.removeColumn('users', 'blitz_elo');
}