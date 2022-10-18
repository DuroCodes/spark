module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['*.md'],
  plugins: ['@typescript-eslint'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'no-unused-vars': 'off',
    'no-inner-declarations': 'off',
    'no-shadow': 'off',
    'linebreak-style': 'off',
    'no-void': 'off',
    'no-restricted-syntax': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'no-new': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
    'jsx-quotes': ['error', 'prefer-double'],
  },
  globals: {
    JSX: true,
  }
};
