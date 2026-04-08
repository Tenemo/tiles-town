import { GAME_SIZE_LIMITS } from '@tiles-town/contracts';

export const gameClientConfig = {
    minSize: GAME_SIZE_LIMITS.min,
    maxSize: GAME_SIZE_LIMITS.max,
} as const;
