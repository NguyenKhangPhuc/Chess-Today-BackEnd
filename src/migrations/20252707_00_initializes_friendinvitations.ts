import { QueryInterface, DataTypes } from 'sequelize';

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('invitations', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        receiver_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },
        sender_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }, allowNull: false },
        status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' },
        created_at: DataTypes.TIME,
        updated_at: DataTypes.TIME
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('invitations');
}