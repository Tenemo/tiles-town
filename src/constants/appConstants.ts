export const BUILD_TYPE = process.env.NODE_ENV || `production`;
export const PORT = process.env.PORT || 3000;

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
