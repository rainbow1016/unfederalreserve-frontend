module.exports = {
  extends: [
    // Use the Standard config as the base
    // https://github.com/stylelint/stylelint-config-standard
    'stylelint-config-standard',
    // Enforce a standard order for CSS properties
    // https://github.com/stormwarning/stylelint-config-recess-order
    'stylelint-config-recess-order',
  ],
  plugins: [
    'stylelint-scss',
    'stylelint-declaration-strict-value',
  ],
  // Rule lists:
  // - https://stylelint.io/user-guide/rules/
  // - https://github.com/kristerkari/stylelint-scss#list-of-rules
  rules: {
    'string-quotes': 'double',
    'string-no-newline': null,
    'selector-max-universal': 1,
    'selector-max-type': [0, { ignore: ['child', 'descendant', 'compounded'] }],
    'max-nesting-depth': [3, {
      ignore: [
        'pseudo-classes',
        'blockless-at-rules',
      ],
      ignoreAtRules: [
        'media',
      ],
    }],
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: [
        'global',
        'export',
        'import',
        'local',
      ],
    }],

    // ===
    // SCSS
    // ===
    'scss/dollar-variable-colon-space-after': 'always',
    'scss/dollar-variable-colon-space-before': 'never',
    'scss/dollar-variable-no-missing-interpolation': true,
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/operator-no-newline-before': true,
    'scss/operator-no-unspaced': true,
    'scss/selector-no-redundant-nesting-selector': true,
    // Allow SCSS and CSS module keywords beginning with `@`
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
  },
};
