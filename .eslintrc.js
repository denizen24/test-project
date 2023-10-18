module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', "import"],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  settings: {
    "import/resolver": {
      typescript: {},
      node: {
        "extensions": [".ts", ".tsx", ".d.ts"],
        "moduleDirectory": [".", "node_modules"]
      }
    }
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Common npm package imports
          'external', // @nestjs imports
          'internal', // @common, @base, @utils, @api imports
          ['parent', 'sibling', 'index'], // Relative imports
        ],
        pathGroups: [
          {
            pattern: "*",
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@nestjs/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@common/**/*',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@utils/**/*',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@base/**/*',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@api/**/*',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'], 
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always', // Add a newline between groups
      },
    ],
  },
};
