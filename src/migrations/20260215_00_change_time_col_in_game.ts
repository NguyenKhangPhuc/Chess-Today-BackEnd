import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.changeColumn("games", "player_1_time_left", {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 600,
    });
    await queryInterface.changeColumn("games", "player_2_time_left", {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 600,
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.changeColumn("games", "player_1_time_left", {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 600
    });
    await queryInterface.changeColumn("games", "player_2_time_left", {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 600
    });
}
