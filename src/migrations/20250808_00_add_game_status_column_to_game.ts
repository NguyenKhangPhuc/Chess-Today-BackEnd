import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('games', 'game_status', {
        type: DataTypes.ENUM('finished', 'playing'),
        allowNull: false,
        defaultValue: 'playing'
    });

}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('games', 'game_status');
}