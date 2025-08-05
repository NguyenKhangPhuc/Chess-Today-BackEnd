import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('games', 'player_1_last_move_time', {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('games', 'player_2_last_move_time', {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('games', 'player_1_time_left', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 600
    });
    await queryInterface.addColumn('games', 'player_2_time_left', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 600
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('games', 'player_1_last_move_time');
    await queryInterface.removeColumn('games', 'player_2_last_move_time');
    await queryInterface.removeColumn('games', 'player_1_time_left');
    await queryInterface.removeColumn('games', 'player_2_time_left');
}