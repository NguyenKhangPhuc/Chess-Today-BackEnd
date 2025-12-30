import { Sequelize } from "sequelize";
import { DATABASE_URL } from "./config";
import { Umzug, SequelizeStorage } from "umzug";

// Setting up postgreSQL DB with Umzug

export const sequelize = new Sequelize(DATABASE_URL, { logging: false });

// Create the connection and run the migration
export const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        await runMigration();
        console.log('Connect to DB successfully');
    } catch (error) {
        console.log(error);
    }
};

// Migration config, all files migration go to src/migrations folder
const migrationConfig = {
    migrations: {
        glob: 'src/migrations/*.ts',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(), // passing the sequelize query interface to the context of migration files
    logger: console
};

// Run the migration
export const runMigration = async () => {
    const migrator = new Umzug(migrationConfig);
    const migrations = await migrator.up();
    console.log('Current migrations', { files: migrations.map(mig => mig.name) });
};

// Rollback the previous migration
export const downMigration = async () => {
    const migrator = new Umzug(migrationConfig);
    await migrator.down();
};



