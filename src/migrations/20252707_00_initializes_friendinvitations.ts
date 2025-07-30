import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('invitations', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        receiver_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        sender_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME }
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('invitations');
}