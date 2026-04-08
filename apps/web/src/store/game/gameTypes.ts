import type { HighScore } from '@tiles-town/contracts';

export type PreviousGameState = {
    size: number | null;
    seed: string;
    moveCount: number | null;
    time: number | null;
    score: number | null;
    gameId: string;
    easyMode: boolean | null;
    isSeedCustom: boolean | null;
    playerName: string;
    moves: string[];
};

export type GameState = {
    requestsCount: number;
    board: number[][];
    receivedBoard: number[][];
    size: number;
    newSize: number;
    leftCount: number;
    playerName: string;
    gameId: string;
    moveCount: number;
    moves: string[];
    seed: string;
    easyMode: boolean;
    highScores: HighScore[];
    isDisabled: boolean;
    firstTime: boolean;
    previous: PreviousGameState;
};
