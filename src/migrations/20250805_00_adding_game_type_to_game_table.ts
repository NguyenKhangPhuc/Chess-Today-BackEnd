import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('games', 'game_type', {
        type: DataTypes.ENUM('Rapid', 'Blitz', 'Rocket'),
        allowNull: false,
        defaultValue: 'Rapid'
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('games', 'game_type');
}