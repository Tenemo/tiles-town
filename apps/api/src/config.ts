import Joi from 'joi';
import { config as loadEnv } from 'dotenv';
import { GAME_SIZE_LIMITS } from '@tiles-town/contracts';

loadEnv();

export const GAME_CONFIG = {
    minSize: GAME_SIZE_LIMITS.min,
    maxSize: GAME_SIZE_LIMITS.max,
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
} as const;

type DatabaseConfig = {
    database: string;
    port: number;
    host: string;
    user: string;
    password: string;
    ssl: boolean;
};

type EnvConfig = {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    DATABASE_SSL: boolean;
    SENTRY_ENABLED: boolean;
};

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow('development', 'production', 'test')
        .default('production'),
    PORT: Joi.number().default(4200),
    DATABASE_URL: Joi.string()
        .uri({ scheme: ['postgres', 'postgresql'] })
        .required(),
    DATABASE_SSL: Joi.boolean().default(true),
    SENTRY_ENABLED: Joi.boolean().default(false),
})
    .unknown()
    .required();

const validationResult = envSchema.validate(process.env, {
    abortEarly: false,
    convert: true,
});

if (validationResult.error) {
    throw validationResult.error;
}

const env = validationResult.value as EnvConfig;

const databaseUrl = new URL(env.DATABASE_URL);

export const config: {
    env: string;
    port: number;
    sentryEnabled: boolean;
    postgres: DatabaseConfig;
} = {
    env: env.NODE_ENV,
    port: env.PORT,
    sentryEnabled: env.SENTRY_ENABLED,
    postgres: {
        database: databaseUrl.pathname.replace(/^\//, ''),
        port: databaseUrl.port ? parseInt(databaseUrl.port, 10) : 5432,
        host: databaseUrl.hostname,
        user: decodeURIComponent(databaseUrl.username),
        password: decodeURIComponent(databaseUrl.password),
        ssl: env.DATABASE_SSL,
    },
};
