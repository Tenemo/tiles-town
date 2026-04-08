import { randomBytes } from 'node:crypto';
import { Op } from 'sequelize';
import type {
    HighScore,
    NewGameRequestBody,
    NewGameResponse,
    WinGameRequestBody,
    WinGameResponse,
} from '@tiles-town/contracts';
import { isMoveWithinBoard } from '@tiles-town/game-core';

import db from '../database';
import { logger } from '../logging';

import { generateBoard } from '../domain/game/generateBoard';
import { checkMoves } from '../domain/game/checkMoves';
import { calculateScore } from '../domain/game/score';

type GameCompletionResult = {
    body: WinGameResponse;
    statusCode?: number;
};

const Game = db.game;
const createGameId = (): string => randomBytes(16).toString('hex');

const normalizeSeed = (seed?: string | null): string | undefined => {
    const trimmedSeed = seed?.trim();
    return trimmedSeed ? trimmedSeed : undefined;
};

const normalizePreviousId = (
    previousId?: string | null,
): string | undefined => {
    const trimmedPreviousId = previousId?.trim();
    return trimmedPreviousId ? trimmedPreviousId : undefined;
};

const normalizePlayerName = (playerName?: string): string => {
    const trimmedPlayerName = playerName?.trim();
    return trimmedPlayerName ? trimmedPlayerName : 'anonymous';
};

export const createNewGame = async (
    input: NewGameRequestBody,
): Promise<NewGameResponse> => {
    const previousId = normalizePreviousId(input.previousId);
    if (previousId) {
        await Game.destroy({
            where: {
                game_id: previousId,
                game_isWon: false,
            },
        });
    }

    const seed = normalizeSeed(input.seed);
    const easyMode = input.easyMode ?? false;
    const board = generateBoard(input.size, seed, easyMode);
    const gameId = createGameId();
    const game = Game.build({
        game_id: gameId,
        game_size: board.size,
        game_seed: board.seed,
        game_isSeedCustom: !!seed,
        game_easyMode: easyMode,
        game_isWon: false,
    });

    await game.save();

    return {
        board: board.tiles,
        gameId,
        size: board.size,
    };
};

export const completeGame = async (
    gameId: string,
    input: WinGameRequestBody,
): Promise<GameCompletionResult> => {
    const game = await Game.findOne({ where: { game_id: gameId } });

    if (!game) {
        return {
            statusCode: 404,
            body: {
                info: "Game doesn't exist",
            },
        };
    }

    if (game.game_isWon) {
        return {
            body: {
                info: "You've won already",
                isWon: game.game_isWon,
                score: game.game_score ?? undefined,
            },
        };
    }

    if (!input.moves.every((move) => isMoveWithinBoard(move, game.game_size))) {
        return {
            statusCode: 400,
            body: {
                info: 'Illegal move sequence',
            },
        };
    }

    game.game_moves = input.moves.join(',');

    let isWon: boolean;
    try {
        isWon = checkMoves(game);
    } catch (error) {
        if (error instanceof Error && error.message === 'Illegal move!') {
            return {
                statusCode: 400,
                body: {
                    info: 'Illegal move sequence',
                },
            };
        }

        throw error;
    }

    if (!isWon) {
        return {
            statusCode: 400,
            body: {
                info: 'Illegal move sequence',
            },
        };
    }

    const playerName = normalizePlayerName(input.playerName);

    logger.info('GAME WON');
    logger.info(`PLAYER: ${playerName}`);
    logger.info(`MOVE COUNT: ${input.moves.length}`);

    game.game_player_name = playerName;
    game.game_end_time = new Date();
    game.game_time = Number(game.game_end_time) - Number(game.game_start_time);
    game.game_move_count = input.moves.length;
    game.game_isWon = true;

    const score = calculateScore(game);
    if (score !== null) {
        game.game_score = score;
    }

    await game.save();

    return {
        body: {
            score: game.game_score ?? undefined,
            time: game.game_time,
            moveCount: game.game_move_count,
            seed: game.game_seed,
            isSeedCustom: game.game_isSeedCustom,
        },
    };
};

export const fetchHighScores = async (): Promise<HighScore[]> => {
    const scores = await Game.findAll({
        limit: 20,
        where: {
            game_isWon: true,
            game_isSeedCustom: false,
            game_easyMode: false,
            game_player_name: { [Op.ne]: '' },
        },
        order: [
            ['game_score', 'DESC'],
            ['game_size', 'DESC'],
        ],
        attributes: [
            'game_score',
            'game_player_name',
            'game_size',
            'game_move_count',
            'game_time',
        ],
    });

    return scores as HighScore[];
};
