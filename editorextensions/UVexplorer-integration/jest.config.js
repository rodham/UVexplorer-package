/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/control-panel/'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: 'test/tsconfig.json'
            }
        ]
    }
};
