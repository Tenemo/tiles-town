import md5 from 'md5';
import { Op } from 'sequelize';
import type {
    HighScore,
    NewGameRequestBody,
    NewGameResponse,
    WinGameRequestBody,
    WinGameResponse,
} from '@tiles-town/contracts';

import db from 'database';
import { GAME_CONFIG } from 'config';
import { randBetween } from 'utils/helpers';

import { generateBoard } from '../controllers/game/generateBoard';
import { checkMoves } from '../controllers/game/checkMoves';
import { calculateScore } from '../controllers/game/score';

type GameCompletionResult = {
    body: WinGameResponse;
    statusCode?: number;
};

const Game = db.game;

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
    const gameId = md5(`${Date.now()}${board.tiles.join()}`);
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

    console.log('GAME WON');
    console.log(`PLAYER: ${playerName}`);
    console.log(`MOVE COUNT: ${input.moves.length}`);

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

export const updateScores = async (): Promise<string> => {
    const result = await Game.findAll({
        where: {
            game_isWon: true,
            game_isSeedCustom: false,
            game_player_name: { [Op.ne]: '' },
        },
    });

    for (const element of result) {
        const game = await Game.findOne({
            where: { game_id: element.game_id },
        });

        if (!game) {
            continue;
        }

        const oldScore = game.game_score;
        const newScore = calculateScore(game);
        if (newScore === null) {
            throw new Error('Score is null.');
        }
        game.game_score = newScore;

        await game.save();
        console.log(
            `Updated ${element.game_id}'s score from ${
                oldScore?.toString() ?? ''
            } to ${game.game_score?.toString() ?? ''}`,
        );
    }

    return `Updated score in ${result.length} rows`;
};

export const generateFakeData = async (): Promise<string> => {
    for (let i = 0; i < 10000; i += 1) {
        await Game.create({
            game_id: md5(Date.now().toString()),
            game_size: randBetween(GAME_CONFIG.minSize, GAME_CONFIG.maxSize),
            game_easyMode: Math.random() < 0.5,
            game_seed: (Date.now() * 2).toString(),
            game_isSeedCustom: false,
            game_isWon: true,
            game_score: randBetween(1000, 200000),
            game_player_name: md5(Date.now().toString()).substring(0, 3),
            game_move_count: randBetween(10, 50),
            game_moves: (() => {
                const moves = [];
                const possibleCharacters = GAME_CONFIG.alphabet.slice(
                    0,
                    GAME_CONFIG.maxSize,
                );

                for (let j = 0; j < randBetween(10, 200); j += 1) {
                    const letter = possibleCharacters.charAt(
                        Math.floor(Math.random() * GAME_CONFIG.maxSize),
                    );
                    const number = randBetween(1, 16);
                    moves[j] = `${letter}${number.toString()}`;
                }

                return moves.toString();
            })(),
            game_start_time: new Date(Date.now() - randBetween(1000, 20000)),
            game_end_time: new Date(Date.now() + randBetween(1000, 20000)),
            game_time:
                Date.now() +
                randBetween(1000, 20000) -
                (Date.now() - randBetween(1000, 20000)),
        });
    }

    return 'Fake data generated successfully';
};
