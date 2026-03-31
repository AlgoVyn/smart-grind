// ESLint v9 Flat Configuration
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    // Base configuration for all files
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'coverage/**',
            'public/**/*.js',
        ],
    },
    
    // ESLint recommended rules
    js.configs.recommended,
    
    // TypeScript configuration
    ...ts.configs.recommended,
    
    // Prettier compatibility (disables formatting rules)
    prettier,
    
    // Global configuration
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
                marked: 'readonly',
                Prism: 'readonly',
            },
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            // Core ESLint rules
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
            'no-console': 'off', // Allow console in this codebase
            'prefer-const': 'error',
            'no-var': 'error',
            'no-useless-escape': 'error',
            'no-control-regex': 'off', // Allow control characters for sanitization
            
            // Code Quality Rules - Added for better maintainability
            'max-lines-per-function': ['warn', { 
                max: 50, 
                skipBlankLines: true, 
                skipComments: true 
            }],
            'max-params': ['warn', 4],
            'complexity': ['warn', 15],
            'max-nested-callbacks': ['warn', 4],
            'no-nested-ternary': 'warn',
            
            // TypeScript rules
            '@typescript-eslint/no-unused-vars': ['warn', { 
                argsIgnorePattern: '^_', 
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
            }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
    },
    
    // Special configuration for functions and tests (no project reference needed)
    {
        files: ['functions/**/*.ts', 'tests/**/*.ts', '**/*.test.ts'],
        languageOptions: {
            parserOptions: {
                project: null,
            },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            // Relax code quality rules for tests
            'max-lines-per-function': 'off',
            'complexity': 'off',
        },
    },
    
    // JavaScript files configuration (e2e, config files)
    {
        files: ['e2e/**/*.js', 'playwright.config.js', 'tailwind.config.js', 'vite.config.ts'],
        languageOptions: {
            parserOptions: {
                project: null,
            },
        },
    },
];
