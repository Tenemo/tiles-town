import { connectDatabase } from './database';
import { startServer } from './server';

const main = async (): Promise<void> => {
    await connectDatabase();
    startServer();
};

void main().catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
});
