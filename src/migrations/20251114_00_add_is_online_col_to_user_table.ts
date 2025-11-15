import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('users', 'is_online', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('users', 'is_online');
}