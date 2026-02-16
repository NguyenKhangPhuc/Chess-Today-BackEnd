import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.changeColumn("moves", "player_time_left", {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 600,
    });

}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.changeColumn("moves", "player_time_left", {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 600
    });
}
