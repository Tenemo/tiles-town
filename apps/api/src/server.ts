import { Server } from 'http';
import express, { ErrorRequestHandler, json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from './routes/router';
import { config } from './config';
import { logger, setupLogging } from './logging';

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

            const corsError = new Error(
                `Blocked by CORS: ${origin}`,
            ) as Error & {
                statusCode?: number;
            };
            corsError.statusCode = 403;
            callback(corsError);
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

const { errorLogger, sentryErrorHandler } = setupLogging(app);

app.use('/api', router);
app.use(sentryErrorHandler);
app.use(errorLogger);

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

export const startServer = (): Server =>
    app.listen(config.port, () => {
        logger.info(
            `Server running on port ${config.port} in ${config.env} environment`,
        );
    });
