import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('challenges', 'game_type', {
        type: DataTypes.ENUM('Blitz', 'Rocket', 'Rapid'),
        allowNull: false,
        defaultValue: 'Rapid',
    });

    await queryInterface.addColumn('challenges', 'player_time', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 600,
    });
    await queryInterface.addColumn('challenges', 'is_sender_player1', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('challenges', 'game_type');
    await queryInterface.removeColumn('challenges', 'player_time');
    await queryInterface.removeColumn('challenges', 'is_sender_player1');
}