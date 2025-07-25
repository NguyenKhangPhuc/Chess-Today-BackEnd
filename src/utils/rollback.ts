import { downMigration } from "./db";

downMigration().catch(() => { });