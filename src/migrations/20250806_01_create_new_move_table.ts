import { DataTypes, QueryInterface } from "sequelize";


export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('moves', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        game_id: { type: DataTypes.UUID, references: { model: 'games', key: 'id' }, allowNull: false },
        before: { type: DataTypes.TEXT, allowNull: false },
        after: { type: DataTypes.TEXT, allowNull: false },
        color: { type: DataTypes.TEXT, allowNull: false },
        piece: { type: DataTypes.TEXT, allowNull: false },
        from: { type: DataTypes.TEXT, allowNull: false },
        to: { type: DataTypes.TEXT, allowNull: false },
        san: { type: DataTypes.TEXT, allowNull: false },
        lan: { type: DataTypes.TEXT, allowNull: false },
        mover_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE }
    });
}


export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('moves');
}