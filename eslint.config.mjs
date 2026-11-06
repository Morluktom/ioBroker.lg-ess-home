import config from '@iobroker/eslint-config';

export default [
  ...config,
  {
    ignores: [
      '**/node_modules/**',
      'widgets/**',
      'www/**',
      'www-react/**',
      'admin/**',
      '.dev-server/**',
      '**/*.min.js',
      '**/vendor/**',
    ],
  },
];
