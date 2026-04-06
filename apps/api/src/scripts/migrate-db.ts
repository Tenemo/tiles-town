import { closeDatabase } from '../database';
import { migrateDatabase } from '../migrator';

const main = async (): Promise<void> => {
    await migrateDatabase();
    await closeDatabase();
};

void main().catch(async (error: Error) => {
    console.error(error.message);
    try {
        await closeDatabase();
    } catch {
        // nothing else to do here
    }
    process.exit(1);
});
