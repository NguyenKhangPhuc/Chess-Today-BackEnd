import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('friendships', 'user_a', {
        type: DataTypes.UUID,
        allowNull: false,
    });

    await queryInterface.addColumn('friendships', 'user_b', {
        type: DataTypes.UUID,
        allowNull: false,
    });

    await queryInterface.addIndex('friendships', {
        unique: true,
        fields: ['user_a', 'user_b'],
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addIndex('friendships', ['userA', 'userB'], { unique: true });
}