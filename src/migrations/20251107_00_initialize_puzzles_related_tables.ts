import { QueryInterface, DataTypes, Sequelize } from "sequelize";

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.createTable('puzzles', {
        id: { allowNull: false, primaryKey: true, type: DataTypes.UUID, defaultValue: Sequelize.literal('uuid_generate_v4()') },
        fen: { type: DataTypes.TEXT, allowNull: false },
        title: { type: DataTypes.TEXT, allowNull: false },
        difficulty: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 3 } },
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.createTable('puzzle_moves', {
        id: { type: DataTypes.UUID, defaultValue: Sequelize.literal('uuid_generate_v4()'), allowNull: false, primaryKey: true },
        puzzle_id: { type: DataTypes.UUID, references: { model: 'puzzles', key: 'id' }, allowNull: false },
        before: { type: DataTypes.TEXT, allowNull: false },
        after: { type: DataTypes.TEXT, allowNull: false },
        color: { type: DataTypes.TEXT, allowNull: false },
        piece: { type: DataTypes.TEXT, allowNull: false },
        from: { type: DataTypes.TEXT, allowNull: false },
        to: { type: DataTypes.TEXT, allowNull: false },
        san: { type: DataTypes.TEXT, allowNull: false },
        lan: { type: DataTypes.TEXT, allowNull: false },
        promotion: { type: DataTypes.TEXT },
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.createTable('users_puzzles', {
        id: { type: DataTypes.UUID, defaultValue: Sequelize.literal('uuid_generate_v4()'), primaryKey: true },
        user_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' }, allowNull: false },
        puzzle_id: { type: DataTypes.UUID, references: { model: 'puzzles', key: 'id' }, allowNull: false },
        status: { type: DataTypes.ENUM('solved', 'unsolved'), defaultValue: 'solved', allowNull: false },
        attempt: { type: DataTypes.INTEGER, allowNull: false },
        created_at: { type: DataTypes.DATE, allowNull: false },
        updated_at: { type: DataTypes.DATE, allowNull: false },
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.dropTable('puzzles');
    await queryInterface.dropTable('puzzle_moves');
    await queryInterface.dropTable('users_puzzles');
}