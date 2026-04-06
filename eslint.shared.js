const OFF = 0;
const ERROR = 2;

const prettierRule = [
    ERROR,
    {
        useTabs: false,
        semi: true,
        singleQuote: true,
        jsxSingleQuote: false,
        trailingComma: 'all',
        arrowParens: 'always',
    },
];

const sharedExtends = [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
];

const sharedPlugins = ['@typescript-eslint', 'import', 'prettier'];

const sharedSettings = {
    'import/resolver': {
        typescript: {},
    },
};

const sharedRules = {
    quotes: OFF,
    'prettier/prettier': prettierRule,
    'no-unused-vars': OFF,
    'arrow-parens': [ERROR, 'always', { requireForBlockBody: false }],
    'no-use-before-define': OFF,
    'no-restricted-exports': OFF,
    'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
    'import/prefer-default-export': OFF,
    'import/extensions': [
        ERROR,
        'ignorePackages',
        {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
        },
    ],
    '@typescript-eslint/explicit-function-return-type': [
        ERROR,
        {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
        },
    ],
    '@typescript-eslint/explicit-module-boundary-types': ERROR,
    '@typescript-eslint/no-unused-vars': OFF,
    '@typescript-eslint/no-use-before-define': ERROR,
    '@typescript-eslint/unbound-method': ERROR,
};

const sharedOverrides = [
    {
        files: ['*.js'],
        rules: {
            '@typescript-eslint/no-var-requires': OFF,
        },
    },
];

module.exports = {
    OFF,
    ERROR,
    sharedExtends,
    sharedPlugins,
    sharedSettings,
    sharedRules,
    sharedOverrides,
};
