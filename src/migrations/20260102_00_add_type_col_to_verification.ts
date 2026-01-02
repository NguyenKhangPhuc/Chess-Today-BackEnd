import { DataTypes, QueryInterface } from "sequelize";
import { VERIFICATION_TYPE } from "../types/enum";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('verification', 'type', {
        type: DataTypes.ENUM('PASSWORD_RESET', 'AUTHENTICATION'),
        allowNull: false,
        defaultValue: VERIFICATION_TYPE.AUTHENTICATION,
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeColumn('verification', 'type');
}