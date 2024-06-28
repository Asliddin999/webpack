const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/'
}
const fs = require('fs');
const htmlPageNames = [];
const pages = fs.readdirSync('./src/html/');
pages.forEach(item => {
    let res = item.split('.');
    htmlPageNames.push(res);
});
const multipleHtmlPlugins = htmlPageNames.map(name => {
   return new HtmlWebpackPlugin({
        template: `${PATHS.src}/html/${name[0]}.${name[1]}`,
        filename: `${name[0]}.html`,
        scriptLoading: 'blocking'
    });
})



module.exports = {
    entry: {
        app: path.resolve(__dirname, PATHS.src)
    },
    output: {
        filename: `${PATHS.assets}js/[name].js`,
        path: path.resolve(__dirname, PATHS.dist),
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                defaultVendors: {
                    filename: `${PATHS.assets}js/vendors.js`,
                    test: /node_modules/,
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.pug$/,
                loader: '@webdiscus/pug-loader'
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: `${PATHS.assets}fonts/`
                }
            },
            {
                test: /\.(png|jpg|jpeg|webp|svg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    esModule: false,
                    outputPath: `${PATHS.assets}img/`
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'global'
                            },
                            esModule: false
                        }
                    },
                    "postcss-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
       
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].css`
        }),
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                    plugins: [
                        ['gifsicle', {interlaced: true}],
                        ['jpegtran', {progressive: true}],
                        ['mozjpeg', {progressive: true, quality: 40}],
                        ['optipng', {optimizationLevel: 5}],
                        ['svgo', {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    convertShapeToPath: {
                                        convertArcs: true
                                    },
                                    convertPathData: false
                                }
                            }
                        }]
                    ]
                }
            }
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: `${PATHS.src}/assets/img`,
                    to: `${PATHS.assets}img`
                },
                {
                    from: `${PATHS.src}/assets/fonts`,
                    to: `${PATHS.assets}fonts`
                },
                {
                    from: `${PATHS.src}/static`,
                    to: ``
                },
            ]
        })
    ].concat(multipleHtmlPlugins)
}