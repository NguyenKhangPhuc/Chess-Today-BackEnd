import { DataTypes, QueryInterface } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addColumn('chat_boxes', 'user_a', {
        type: DataTypes.UUID,
        allowNull: false,
    });

    await queryInterface.addColumn('chat_boxes', 'user_b', {
        type: DataTypes.UUID,
        allowNull: false,
    });

    await queryInterface.addIndex('chat_boxes', {
        unique: true,
        fields: ['user_a', 'user_b'],
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addIndex('chat_boxes', ['userA', 'userB'], { unique: true });
}