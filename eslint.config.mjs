import jslint from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tslint from 'typescript-eslint';

export default [
  jslint.configs.recommended,
  ...tslint.configs.recommended,
  pluginPrettier,

  /* Custom config */
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
