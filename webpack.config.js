const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/src/app.ts'),
    output: {
        filename: 'app.js',
        path: __dirname,
        libraryTarget: 'var',
        library: 'Snake'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};
