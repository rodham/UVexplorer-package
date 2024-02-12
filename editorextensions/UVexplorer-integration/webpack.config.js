const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: './src/extension.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /[\\\/]resources[\\\/]/,
                use: 'raw-loader',
                exclude: /\.json$/
            }
        ]
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bin/extension.js',
        path: __dirname
    },
    mode: 'development'
};
