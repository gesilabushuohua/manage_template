module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-await-in-loop': 'warn',
    curly: ['error', 'all'],
    'default-case': 'error',
    eqeqeq: ['error', 'always'],
    'no-alert': 'error',
    'no-caller': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-floating-decimal': 'error',
    'no-implied-eval': 'error',
    'no-labels': 'error',
    'no-multi-str': 'error',
    'no-new-wrappers': 'error',
    'no-return-assign': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-with': 'error',
    radix: 'error',
    'require-await': 'error',
    'wrap-iife': 'error',
    'no-shadow': 'error',
    'no-shadow-restricted-names': 'error',
    'no-undef-init': 'error',
    'no-use-before-define': 'error',
    'array-bracket-newline': [
      'error',
      {
        multiline: true
      }
    ],
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    camelcase: [
      'error',
      {
        properties: 'always'
      }
    ],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': 'error',
    'comma-style': 'error',
    'computed-property-spacing': 'error',
    'func-call-spacing': 'error',
    'function-paren-newline': ['error', 'multiline'],
    'implicit-arrow-linebreak': 'error',
    indent: ['error', 2, { SwitchCase: 1 }],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'line-comment-position': [
      'error',
      {
        position: 'above'
      }
    ],
    'lines-around-comment': [
      'error',
      {
        beforeLineComment: true,
        allowBlockStart: true
      }
    ],
    'multiline-ternary': ['error', 'always-multiline'],
    'new-cap': 'error',
    'new-parens': 'error',
    'no-inline-comments': 'error',
    'no-mixed-operators': 'error',
    'no-multi-assign': 'error',
    'no-multiple-empty-lines': 'error',
    'no-nested-ternary': 'error',
    'no-new-object': 'error',
    'no-array-constructor': 'warn',
    'no-whitespace-before-property': 'error',
    'array-callback-return': 'error',
    'object-curly-newline': ['error', { consistent: true }],
    'operator-linebreak': ['error', 'before'],
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-before-blocks': 'error',
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false
      }
    ],
    'spaced-comment': ['error', 'always'],
    'arrow-spacing': 'error',
    'no-duplicate-imports': 'error',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'prefer-destructuring': 'warn',
    'prefer-rest-params': 'error',
    'prefer-spread': 'warn',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'rest-spread-spacing': 'error',
    'no-loop-func': 'error',
    'one-var': ['error', 'never'],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true
      }
    ],
    'no-unneeded-ternary': 'error',
    'no-else-return': 'error',
    'object-curly-spacing': ['error', 'always'],
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'never',
          normal: 'never',
          component: 'always'
        }
      }
    ],
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 4,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
