import globals from 'globals'
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'

export default [
    {
        ignores: ['vendor/', '**/*.md', '**/*.html'],
    },
    js.configs.recommended,
    prettierConfig,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        rules: {
            'no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
]
