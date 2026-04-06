const extensions = ['.js', '.ts'];

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '24.14',
                },
                useBuiltIns: 'usage',
                corejs: 3,
                modules: 'commonjs',
            },
        ],
        [
            '@babel/preset-typescript',
            {
                allowDeclareFields: true,
            },
        ],
    ],
    plugins: [
        [
            'module-resolver',
            {
                extensions,
                root: ['./src'],
            },
        ],
    ],
    ignore: ['node_modules'],
};
