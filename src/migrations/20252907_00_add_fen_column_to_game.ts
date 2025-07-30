import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('games', 'fen', {
        type: DataTypes.TEXT
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('games', 'fen');
}