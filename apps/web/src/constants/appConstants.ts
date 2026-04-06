import { GAME_SIZE_LIMITS } from '@tiles-town/contracts';

export const BUILD_TYPE = import.meta.env.MODE || 'production';

export const gameClientConfig = {
    minSize: GAME_SIZE_LIMITS.min,
    maxSize: GAME_SIZE_LIMITS.max,
} as const;

export const COLOR_VARIABLES = [
    'primary',
    'primary-light',
    'primary-string',
    'secondary',
    'secondary-light',
    'bg',
    'links',
    'active',
] as const;
