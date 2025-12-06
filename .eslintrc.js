module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'import/order': 'off',
    'import/newline-after-import': 'off',
    'newline-before-return': 'off',
    'padding-line-between-statements': 'off',
    'lines-around-comment': 'off'
  }
}
