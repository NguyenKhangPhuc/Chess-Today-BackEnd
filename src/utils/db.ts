import { Sequelize } from "sequelize";
import { DATABASE_URL } from "./config";
import { Umzug, SequelizeStorage } from "umzug";

export const sequelize = new Sequelize(DATABASE_URL);

export const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        await runMigration();
        console.log('Connect to DB successfully');
    } catch (error) {
        console.log(error);
    }
};


const migrationConfig = {
    migrations: {
        glob: 'src/migrations/*.ts',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console
};

export const runMigration = async () => {
    const migrator = new Umzug(migrationConfig);
    const migrations = await migrator.up();
    console.log('Current migrations', { files: migrations.map(mig => mig.name) });
};


export const downMigration = async () => {
    const migrator = new Umzug(migrationConfig);
    await migrator.down();
};



