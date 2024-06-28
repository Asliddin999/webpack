module.exports = {
    plugins: [
        // require('postcss-preset-env'),
        require('css-mqpacker'),
        require('autoprefixer')({
            grid: true
        }),
        require('cssnano')({
            preset: ['default', {
                discardComments: {
                    removeAll: true
                }
            }]
        })
    ]
}