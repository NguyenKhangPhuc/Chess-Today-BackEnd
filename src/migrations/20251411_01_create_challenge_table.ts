import { DataTypes, QueryInterface } from "sequelize";


export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('challenges', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        sender_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        receiver_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending', allowNull: false },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('challenges');
}