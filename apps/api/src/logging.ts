import { Express, ErrorRequestHandler } from 'express';
import * as winston from 'winston';
import { Logger } from 'winston';
import * as Sentry from '@sentry/node';
import * as expressWinston from 'express-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import morgan, { StreamOptions } from 'morgan';
import { config } from './config';

// TODO: don't disable this rule
/* eslint-disable @typescript-eslint/restrict-template-expressions */
const winstonFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return typeof stack === 'string'
            ? `${timestamp} [${level}] ${message}\n${stack}`
            : `${timestamp} [${level}] ${message}`;
    }),
);
/* eslint-enable @typescript-eslint/restrict-template-expressions */

const transports: winston.transport[] = [
    new winston.transports.Console({
        level: 'http',
    }),
];

if (config.env !== 'test') {
    transports.push(
        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'http',
        }),
    );
    transports.push(
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'error',
        }),
    );
}

export const logger: Logger = winston.createLogger({
    format: winstonFormat,
    transports,
});

export const setupLogging = (
    app: Express,
): {
    errorLogger: ErrorRequestHandler;
    sentryErrorHandler: ErrorRequestHandler;
} => {
    if (config.sentryEnabled) {
        Sentry.init({
            dsn: 'https://fe2d28a5bda54932b1914fdb2e81ab4c@o502294.ingest.sentry.io/4504889416089600',
            integrations: [
                Sentry.httpIntegration(),
                Sentry.expressIntegration(),
            ],
            tracesSampleRate: 1.0,
        });
    }

    const morganStream: StreamOptions = {
        write: (message: string) => {
            logger.info(message.trim());
        },
    };
    app.use(morgan('combined', { stream: morganStream }));

    const errorLogger = expressWinston.errorLogger({
        format: winstonFormat,
        transports: [
            new winston.transports.Console({
                level: 'error',
            }),
        ],
    });

    return {
        errorLogger,
        sentryErrorHandler: !config.sentryEnabled
            ? (((err, _req, _res, next) => next(err)) as ErrorRequestHandler)
            : Sentry.expressErrorHandler(),
    };
};
