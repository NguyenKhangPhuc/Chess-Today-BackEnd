import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('users', 'email');
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('users', 'email', {
        type: DataTypes.TEXT,
        allowNull: false
    });
}