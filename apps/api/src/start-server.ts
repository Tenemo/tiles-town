import { connectDatabase } from './database';
import { logger } from './logging';
import { startServer } from './server';

const main = async (): Promise<void> => {
    await connectDatabase();
    startServer();
};

void main().catch((error: Error) => {
    logger.error(error.message);
    process.exit(1);
});
