export const API_PREFIX = '/api';

export const GAME_ROUTES = {
    healthCheck: `${API_PREFIX}/health-check`,
    highScores: `${API_PREFIX}/game/highScores`,
    newGame: `${API_PREFIX}/game/new`,
    winGame: (gameId: string): string => `${API_PREFIX}/game/${gameId}`,
} as const;
