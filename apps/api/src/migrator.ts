import path from 'path';
import { QueryInterface } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';
import { sequelize } from './database';

export type MigrationContext = QueryInterface;

const extension = path.extname(__filename).slice(1);
const migrationsGlob = path.join(
    __dirname,
    'migrations',
    `*.${extension || 'js'}`,
);

export const migrator = new Umzug<MigrationContext>({
    migrations: {
        glob: migrationsGlob,
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({
        sequelize,
    }),
    logger: console,
});

export const migrateDatabase = async (): Promise<void> => {
    await migrator.up();
};
