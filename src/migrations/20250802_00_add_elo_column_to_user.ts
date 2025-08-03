import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('users', 'elo', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 800
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('users', 'elo');
}