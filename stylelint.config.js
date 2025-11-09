export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extend'],
      },
    ],
    'no-descending-specificity': null,
    'order/order': ['custom-properties', 'declarations'],
    'declaration-block-single-line-max-declarations': 1,
    'length-zero-no-unit': true,
    'color-hex-length': 'long',
    'function-url-quotes': 'always',
    'font-family-name-quotes': 'always-unless-keyword',
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['print-color-adjust', 'composes'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local', 'export'],
      },
    ],
  },
  ignoreFiles: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
};