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
    extends: [
        ...sharedExtends,
        'plugin:react/recommended',
        'plugin:jest/recommended',
        'plugin:jsx-a11y/strict',
        'airbnb',
        'airbnb/hooks',
        'prettier',
        'plugin:prettier/recommended',
    ],
    plugins: [...sharedPlugins, 'react', 'react-hooks', 'jest', 'jsx-a11y'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        es6: true,
        jest: true,
        node: true,
    },
    settings: {
        ...sharedSettings,
        react: {
            version: 'detect',
        },
    },
    rules: {
        ...sharedRules,
        'no-void': OFF,
        'no-shadow': OFF, // https://github.com/typescript-eslint/tslint-to-eslint-config/issues/856

        'react/prop-types': OFF,
        'react/react-in-jsx-scope': OFF,
        'react/jsx-uses-react': OFF,
        'react/prefer-stateless-function': OFF,
        'react/destructuring-assignment': [ERROR, 'always'],
        'react/jsx-filename-extension': [
            ERROR,
            {
                extensions: ['.jsx', '.tsx'],
            },
        ],
        'react/jsx-sort-props': ERROR,
        'react/jsx-props-no-spreading': OFF,
        'react/jsx-one-expression-per-line': OFF,
        'react/static-property-placement': [ERROR, 'static public field'],
        'react/state-in-constructor': [ERROR, 'never'],
        'react/display-name': [
            ERROR,
            {
                ignoreTranspilerName: false,
            },
        ],
        'react/function-component-definition': [
            ERROR,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],

        'react-hooks/rules-of-hooks': ERROR,
        'react-hooks/exhaustive-deps': ERROR,
        'import/order': [
            'error',
            {
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true },
                pathGroupsExcludedImportTypes: ['builtin'],
            },
        ],

        'jsx-a11y/label-has-for': [ERROR, { required: { every: ['id'] } }],
        '@typescript-eslint/no-shadow': [ERROR],

        'jest/no-commented-out-tests': ERROR,
    },
    overrides: [
        ...sharedOverrides,
        {
            files: '*Reducer.ts',
            rules: {
                'default-param-last': OFF,
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
