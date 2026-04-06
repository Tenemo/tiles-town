export const BUILD_TYPE = import.meta.env.MODE || 'production';

export const gameClientConfig = {
    minSize: 4,
    maxSize: 16,
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
