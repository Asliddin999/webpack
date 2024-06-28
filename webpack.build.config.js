const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const buildConfig = merge(baseConfig, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin()
    ]
});
module.exports = new Promise((resolve, reject) => {
    resolve(buildConfig);
})