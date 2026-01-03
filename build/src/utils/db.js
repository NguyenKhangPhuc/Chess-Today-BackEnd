"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downMigration = exports.runMigration = exports.connectToDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const umzug_1 = require("umzug");
// Setting up postgreSQL DB with Umzug
exports.sequelize = new sequelize_1.Sequelize(config_1.DATABASE_URL, { logging: false });
// Create the connection and run the migration
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        yield (0, exports.runMigration)();
        console.log('Connect to DB successfully');
    }
    catch (error) {
        console.log(error);
    }
});
exports.connectToDB = connectToDB;
// Migration config, all files migration go to src/migrations folder
const migrationConfig = {
    migrations: {
        glob: 'src/migrations/*.ts',
    },
    storage: new umzug_1.SequelizeStorage({ sequelize: exports.sequelize, tableName: 'migrations' }),
    context: exports.sequelize.getQueryInterface(), // passing the sequelize query interface to the context of migration files
    logger: console
};
// Run the migration
const runMigration = () => __awaiter(void 0, void 0, void 0, function* () {
    const migrator = new umzug_1.Umzug(migrationConfig);
    const migrations = yield migrator.up();
    console.log('Current migrations', { files: migrations.map(mig => mig.name) });
});
exports.runMigration = runMigration;
// Rollback the previous migration
const downMigration = () => __awaiter(void 0, void 0, void 0, function* () {
    const migrator = new umzug_1.Umzug(migrationConfig);
    yield migrator.down();
});
exports.downMigration = downMigration;
