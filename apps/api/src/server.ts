import { Server } from 'http';
import express, { ErrorRequestHandler, json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from 'routes/router';
import { config } from './config';
import { setupLogging } from './logging';

const allowlistedOrigins = new Set([
    ...config.corsAllowedOrigins,
    'http://127.0.0.1:3200',
    'http://localhost:3200',
]);

export const app = express();

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowlistedOrigins.size === 0) {
                callback(null, true);
                return;
            }

            if (allowlistedOrigins.has(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error(`Blocked by CORS: ${origin}`));
        },
    }),
);
app.use(json());
app.use(
    urlencoded({
        extended: true,
    }),
);
app.use(cookieParser());

const { errorLogger, logger, sentryErrorHandler } = setupLogging(app);

app.use('/api', router);
app.use(sentryErrorHandler);

const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    const statusCode =
        typeof (err as { statusCode?: number }).statusCode === 'number'
            ? (err as { statusCode: number }).statusCode
            : 500;
    const sentryId = (res as typeof res & { sentry?: string }).sentry;
    const message =
        err instanceof Error ? err.message : 'Internal server error';

    res.status(statusCode).json({
        message,
        ...(sentryId ? { sentryId } : {}),
    });
};

app.use(onError);
app.use(errorLogger);

const writeLog =
    (level: 'info' | 'warn' | 'error') =>
    (...messages: unknown[]): void => {
        logger.log({
            level,
            message: messages
                .map((message) =>
                    typeof message === 'string'
                        ? message
                        : JSON.stringify(message),
                )
                .join(' '),
        });
    };

console.log = writeLog('info');
console.warn = writeLog('warn');
console.error = writeLog('error');

export const startServer = (): Server =>
    app.listen(config.port, () => {
        console.log(
            `Server running on port ${config.port} in ${config.env} environment`,
        );
    });
