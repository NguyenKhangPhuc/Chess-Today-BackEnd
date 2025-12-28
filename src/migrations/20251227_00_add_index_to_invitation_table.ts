import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('invitations', 'user_a', {
        type: DataTypes.UUID,
        allowNull: false,
    });

    await queryInterface.addColumn('invitations', 'user_b', {
        type: DataTypes.UUID,
        allowNull: false,
    });

    await queryInterface.addIndex('invitations', {
        unique: true,
        fields: ['user_a', 'user_b'],
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addIndex('invitations', ['userA', 'userB'], { unique: true });
}