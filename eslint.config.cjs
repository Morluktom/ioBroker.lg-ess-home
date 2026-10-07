const js = require('@eslint/js');
const eslintConfigIobroker = require('@iobroker/eslint-config-ioBroker');

module.exports = [
  eslintConfigIobroker,
  {
    files: ['**/*.js'],
    rules: {
      'no-unused-vars': 'warn',
    },
  },
];
