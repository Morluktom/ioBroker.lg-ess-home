const globals = require('globals');
const js = require('@eslint/js');

const iobrokerConfig = require('@iobroker/eslint-config');

module.exports = [
    {
        ignores: [
            '.dev-server/**',
            'widgets/**',
            'node_modules/**',
        ],
    },
    ...[].concat(iobrokerConfig || []),
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.mocha,
                Intl: 'readonly',
            },
            ecmaVersion: 2022,
            sourceType: 'commonjs',
        },
        rules: {
            'no-console': 'off',
            ...js.configs.recommended.rules,
        },
    },
];
