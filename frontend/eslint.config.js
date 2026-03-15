/**
 * ESLint Configuration Feil
 * 
 * Establishes linting rules and settings for each JavaScript and JSX files.
 * 
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),   // ignores the production build output from linting
  {
    files: ['**/*.{js,jsx}'],  // rules will be applied to all Javascript & JSX files
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,  
    ],
    languageOptions: {
      ecmaVersion: 2020,  // sets to ES2020 syntax
      globals: globals.browser,  // activates browser global variables
      parserOptions: {  // when parsing
        ecmaVersion: 'latest',  // use the latest ECMA version
        ecmaFeatures: { jsx: true },  // activates JSX support 
        sourceType: 'module',  // files will be treated as ES modules
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], 
      // unused variables will produce errors, other than capitalized components/constants
    },
  },
])
