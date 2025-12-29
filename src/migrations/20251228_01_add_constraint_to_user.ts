import { QueryInterface } from 'sequelize';

export async function up({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.addConstraint('users', {
        fields: ['username'],
        type: 'unique',
        name: 'unique_username'
    });
}

export async function down({ context: queryInterface }: { context: QueryInterface }) {
    await queryInterface.removeConstraint('users', 'unique_username');
}