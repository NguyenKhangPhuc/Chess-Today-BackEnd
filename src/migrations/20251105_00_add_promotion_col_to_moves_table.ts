import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('moves', 'promotion', {
        type: DataTypes.TEXT,
        allowNull: true,
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('moves', 'promotion');
}