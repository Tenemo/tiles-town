import { DataTypes } from 'sequelize';
import type { QueryInterface } from 'sequelize';
import type { MigrationFn } from 'umzug';

type MigrationContext = QueryInterface;

export const up: MigrationFn<MigrationContext> = async ({ context }) => {
    await context.createTable('game', {
        game_number: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        game_id: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        game_size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        game_seed: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        game_easyMode: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        game_isWon: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        game_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        game_player_name: {
            type: DataTypes.STRING(32),
            allowNull: true,
        },
        game_move_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        game_isSeedCustom: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        game_time: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        game_moves: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        game_start_time: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        game_end_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });

    await context.addIndex('game', ['game_id'], {
        name: 'game_game_id_index',
        unique: true,
    });
};

export const down: MigrationFn<MigrationContext> = async ({ context }) => {
    await context.removeIndex('game', 'game_game_id_index');
    await context.dropTable('game');
};
