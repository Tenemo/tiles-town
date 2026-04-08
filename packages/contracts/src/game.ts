import { Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export const GAME_SIZE_LIMITS = {
    min: 4,
    max: 16,
} as const;

const MOVE_COORDINATE_PATTERN = '^[A-Pa-p](?:[1-9]|1[0-6])$';

export const GameBoardSchema = Type.Array(Type.Array(Type.Integer()));
export type GameBoard = Static<typeof GameBoardSchema>;

export const HighScoreSchema = Type.Object({
    game_score: Type.Integer(),
    game_player_name: Type.String(),
    game_size: Type.Integer(),
    game_move_count: Type.Integer(),
    game_time: Type.Integer(),
});
export type HighScore = Static<typeof HighScoreSchema>;

export const HighScoresResponseSchema = Type.Array(HighScoreSchema);
export type HighScoresResponse = Static<typeof HighScoresResponseSchema>;
export const isHighScoresResponse = (
    value: unknown,
): value is HighScoresResponse => Value.Check(HighScoresResponseSchema, value);

export const MessageResponseSchema = Type.Object({
    message: Type.String(),
});
export type MessageResponse = Static<typeof MessageResponseSchema>;

export const GameIdSchema = Type.String({
    pattern: '^[a-z0-9]{32}$',
});
export type GameId = Static<typeof GameIdSchema>;

export const NewGameRequestBodySchema = Type.Object({
    size: Type.Integer({
        minimum: GAME_SIZE_LIMITS.min,
        maximum: GAME_SIZE_LIMITS.max,
    }),
    seed: Type.Optional(
        Type.Union([
            Type.String({
                maxLength: 256,
            }),
            Type.Literal(''),
            Type.Null(),
        ]),
    ),
    easyMode: Type.Optional(Type.Boolean()),
    previousId: Type.Optional(
        Type.Union([GameIdSchema, Type.Literal(''), Type.Null()]),
    ),
});
export type NewGameRequestBody = Static<typeof NewGameRequestBodySchema>;

export const NewGameResponseSchema = Type.Object({
    board: GameBoardSchema,
    gameId: GameIdSchema,
    size: Type.Integer({
        minimum: GAME_SIZE_LIMITS.min,
        maximum: GAME_SIZE_LIMITS.max,
    }),
});
export type NewGameResponse = Static<typeof NewGameResponseSchema>;
export const isNewGameResponse = (value: unknown): value is NewGameResponse =>
    Value.Check(NewGameResponseSchema, value);

export const WinGameParamsSchema = Type.Object({
    id: GameIdSchema,
});
export type WinGameParams = Static<typeof WinGameParamsSchema>;

export const WinGameRequestBodySchema = Type.Object({
    moves: Type.Array(
        Type.String({
            pattern: MOVE_COORDINATE_PATTERN,
        }),
        {
            maxItems: 10000,
        },
    ),
    playerName: Type.Optional(
        Type.String({
            maxLength: 32,
        }),
    ),
});
export type WinGameRequestBody = Static<typeof WinGameRequestBodySchema>;

export const WinGameResponseSchema = Type.Object({
    info: Type.Optional(Type.String()),
    isWon: Type.Optional(Type.Boolean()),
    score: Type.Optional(Type.Integer()),
    time: Type.Optional(Type.Integer()),
    moveCount: Type.Optional(Type.Integer()),
    seed: Type.Optional(Type.String()),
    isSeedCustom: Type.Optional(Type.Boolean()),
});
export type WinGameResponse = Static<typeof WinGameResponseSchema>;
export const isWinGameResponse = (value: unknown): value is WinGameResponse =>
    Value.Check(WinGameResponseSchema, value);
