module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked'
    ],
    env: {
        node: true
    },
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
    },
    root: true,
    overrides: [
        {
            files: ['*.js'],
            extends: ['plugin:@typescript-eslint/disable-type-checked']
        },
        {
            files: ['**/*.test.ts'],
            env: {
                jest: true
            },
            extends: ['plugin:jest/recommended', 'plugin:jest/style'],
            plugins: ['jest'],
            rules: {
                'jest/no-disabled-tests': 'warn',
                'jest/no-focused-tests': 'error',
                'jest/no-identical-title': 'error',
                'jest/prefer-to-have-length': 'warn',
                'jest/valid-expect': 'error'
            }
        },
        {
            files: ['**/*.spec.ts'],
            env: {
                jasmine: true
            },
            extends: ['plugin:jasmine/recommended'],
            plugins: ['jasmine']
        }
    ],
    ignorePatterns: ['*.d.ts']
};
