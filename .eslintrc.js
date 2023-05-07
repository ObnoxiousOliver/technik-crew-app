require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/eslint-config-typescript',
    '@vue/typescript/recommended'
  ],
  plugins: ['unused-imports'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: 'error',
    'comma-dangle': ['error', 'never'],
    'unused-imports/no-unused-imports': 'error',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 3
      },
      multiline: {
        max: 1
      }
    }],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'ignore',
      multiline: 'below'
    }],
    'vue/html-indent': 'error',
    'vue/html-closing-bracket-spacing': ['error', {
      selfClosingTag: 'always'
    }],
    'vue/html-closing-bracket-newline': ['error', {
      multiline: 'always'
    }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      registeredComponentsOnly: false
    }]
  }
}
