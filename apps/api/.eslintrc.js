const {
    OFF,
    ERROR,
    sharedExtends,
    sharedPlugins,
    sharedSettings,
    sharedRules,
    sharedOverrides,
} = require('../../eslint.shared');

module.exports = {
    extends: [...sharedExtends, 'prettier', 'plugin:prettier/recommended'],
    plugins: sharedPlugins,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
    },
    env: {
        es6: true,
        node: true,
    },
    settings: {
        ...sharedSettings,
        'import/resolver': {
            ...sharedSettings['import/resolver'],
            'babel-module': {},
        },
    },
    rules: {
        ...sharedRules,
        eqeqeq: ERROR,
        '@typescript-eslint/require-await': OFF, // Fastify requires async functions everywhere?
        '@typescript-eslint/ban-ts-comment': OFF,
        '@typescript-eslint/no-unused-vars': OFF, // duplicated by ts(6133)
    },
    overrides: [
        ...sharedOverrides,
        {
            files: ['test/**/*.ts'],
            env: {
                node: true,
            },
        },
        {
            files: '*.spec.tsx',
            rules: {
                '@typescript-eslint/ban-ts-comment': OFF,
            },
        },
    ],
};
