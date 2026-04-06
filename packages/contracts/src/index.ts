export const GAME_SIZE_LIMITS = {
    min: 4,
    max: 16,
} as const;

export type GameBoard = number[][];

export interface HighScore {
    game_score: number;
    game_player_name: string;
    game_size: number;
    game_move_count: number;
    game_time: number;
}

export interface NewGameRequestBody {
    size: number;
    seed?: string | null;
    easyMode?: boolean;
    previousId?: string | null;
}

export interface NewGameResponse {
    board: GameBoard;
    gameId: string;
    size: number;
}

export interface WinGameRequestBody {
    moves: string[];
    playerName?: string;
}

export interface WinGameResponse {
    info?: string;
    isWon?: boolean;
    score?: number;
    time?: number;
    moveCount?: number;
    seed?: string;
    isSeedCustom?: boolean;
}
