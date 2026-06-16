import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import astroPlugin from 'eslint-plugin-astro'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import oxlint from 'eslint-plugin-oxlint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['.agents', '.astro', 'dist', 'node_modules', 'public'],
  },

  // Base JS + TypeScript (reglas no-type-aware; las type-aware van a oxlint)
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro: parsea .astro files y aplica reglas específicas
  ...astroPlugin.configs.recommended,

  // Desactiva reglas que ya maneja oxlint
  oxlint.configs['flat/recommended'],

  // Desactiva reglas que conflictúan con oxfmt/prettier
  eslintConfigPrettier,

  // Reglas globales
  {
    plugins: {
      import: importPlugin,
      jsdoc,
      'jsx-a11y': jsxA11y,
      react,
      'react-hooks': reactHooks,
      'sort-destructure-keys': sortDestructureKeys,
    },
    rules: {
      // Accesibilidad
      ...jsxA11y.flatConfigs.recommended.rules,

      // Import ordering
      'import/newline-after-import': 'error',
      'import/order': ['error', { 'newlines-between': 'always' }],

      // React (para islands .tsx) — react/* antes de react-hooks/* (natural sort: '/' < '-')
      ...react.configs.flat.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',

      // Sorting
      'sort-destructure-keys/sort-destructure-keys': 'error',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'sort-keys': ['error', 'asc', { natural: true }],
      'sort-vars': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // En .astro: desactivar reglas de React que no aplican
  // (Astro usa class en lugar de className, y no requiere key en .map())
  {
    files: ['**/*.astro'],
    rules: {
      'react/jsx-key': 'off',
      'react/no-unknown-property': 'off',
      'sort-keys': 'off',
    },
  },

  // JSDoc desactivado — demasiado ruido para componentes UI
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { jsdoc },
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },
)
