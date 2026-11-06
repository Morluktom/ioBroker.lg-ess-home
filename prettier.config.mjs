import prettierConfig from '@iobroker/eslint-config/prettier.config.mjs';

export default {
  ...prettierConfig,
  // Match the existing project style while using the shared ioBroker rules.
  useTabs: false,
  tabWidth: 2,
  singleQuote: false,
  arrowParens: 'always',
};
