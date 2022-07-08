module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:vue/vue3-strongly-recommended', 'airbnb-base'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'espree',
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['vue'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue'],
      },
    },
  },
  ignorePatterns: ['template/**/*'],
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['./vite.config.js', './scripts/*'] }],
    'max-len': ['error', { code: 120, ignoreUrls: true }],
    'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
    'no-return-assign': ['error', 'except-parens'],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'function-paren-newline': ['error', 'multiline'],
    'new-cap': ['error', { properties: false, capIsNew: false }],
    'no-mixed-operators': ['error', { allowSamePrecedence: true }],
    'prefer-destructuring': ['error', { array: true, object: true }, { enforceForRenamedProperties: false }],
    'vue/singleline-html-element-content-newline': ['off'],
    'vue/max-attributes-per-line': ['warn', { singleline: { max: 6 } }],
    'vue/multi-word-component-names': ['off'],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
      },
    ],
  },
};
