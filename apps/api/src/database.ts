import { Sequelize } from 'sequelize';
import _ from 'lodash';
import { initGame } from 'models/game.model';
import { config } from './config';

export const sequelize = new Sequelize(
    config.postgres.database,
    config.postgres.user,
    config.postgres.password,
    {
        logging:
            config.env === 'development'
                ? (message: string) => console.log(message)
                : false,
        dialect: 'postgres',
        dialectOptions: config.postgres.ssl
            ? {
                  ssl: {
                      require: true,
                      rejectUnauthorized: false,
                  },
              }
            : undefined,
        port: config.postgres.port,
        host: config.postgres.host,
        pool: {
            max: 10,
            idle: 30000,
            acquire: 3600 * 1000 * 6,
        },
    },
);

const game = initGame(sequelize);

export const connectDatabase = async (): Promise<void> => {
    await sequelize.authenticate();
};

export const closeDatabase = async (): Promise<void> => {
    await sequelize.close();
};

export default _.extend(
    {
        sequelize,
        Sequelize,
    },
    { game },
);
