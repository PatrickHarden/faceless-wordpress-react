let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body',
    favicon: __dirname + '/lib/img/favicon.ico'
});
let S3Plugin = require('webpack-s3-plugin');

function getPlugins(){
    let plugins = [];

    plugins.push(
        HtmlWebpackPluginConfig
    )

    if(process.env.NODE_ENV === 'local'){
        plugins.push(
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('local')
            })
        )
    }
    else if(process.env.NODE_ENV === 'development'){
        plugins.push(
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development')
            }),
            new S3Plugin({
                s3Options: {
                    accessKeyId: 'AKIAI52FTL4VNEOH3ZZA',
                    secretAccessKey: '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',
                    region: 'us-east-1'
                },
                s3UploadOptions: {
                    Bucket: 'imaginuitycenters'
                },
                basePath: 'v31/dev/regional-v1'
            })
        )
    }
    else if(process.env.NODE_ENV === 'production'){
        plugins.push(
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new S3Plugin({
                s3Options: {
                    accessKeyId: 'AKIAI52FTL4VNEOH3ZZA',
                    secretAccessKey: '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',
                    region: 'us-east-1'
                },
                s3UploadOptions: {
                    Bucket: 'imaginuitycenters'
                },
                basePath: 'v31/prod/regional-v1',
                cloudfrontInvalidateOptions: {
                    DistributionId: 'E9AZII8HL0DC',
                    Items: ["/v31/prod/regional-v1/*"]
                }
            })
        )
    }

    return plugins;
    
}

module.exports = {
    entry: [
        'babel-polyfill',
        './app/index.js'
    ],
    devtool: 'eval',
    output: {
        path: __dirname + '/dist',
        filename: 'index_bundle.js',
        crossOriginLoading: 'anonymous'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: [ "@babel/preset-env","@babel/preset-react" ]
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles SASS to CSS
                }]
            },
            {
                test: /\.png$/,
                loader: "url-loader"
            },
            {
                test: /\.jpg$/,
                loader: "file-loader"
            },
            {
                test: /\.gif$/,
                loader: "file-loader"
            },
            {
                test: /\.svg$/,
                loader: "file-loader"
            },
            {
                test: /\.ico$/,
                loader: "file-loader"
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                loader: 'url-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },
    devServer: {
        headers: { "Access-Control-Allow-Origin": "*"},
        disableHostCheck: true
    },
    plugins: getPlugins()
}