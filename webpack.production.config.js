const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");   //css提取,link引用
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");   //css压缩
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')
const DropConsoleWebpackPlugin = require('./plugins/drop-console-webpack-plugin')
const path = require('path')

// const DropConsoleWebpackPlugin = require('drop-console-webpack-plugin')

const Config = {
    mode: 'production',
	entry: 	__dirname + "/src/index.js",
	output: {
		path:__dirname + "/public",
        filename: "[name]-[contenthash].bundle.js",
        chunkFilename: '[name].[chunkhash:5].chunk.js'
	},
	// devtool:'cheap-module-eval-source-map',
	devServer:{
		contentBase:'./public',   //设置本地服务器目录
		historyApiFallback:true,    //设置为true，所有的跳转将指向index.html
		inline:true, //实时刷新
		port:3000, //端口
        // hot:true,
	},
    optimization: {
        minimizer: [
            new UglifyJsPlugin({     
                cache: false,
                parallel: true,
                sourceMap: false, // set to true if you want JS source maps
                uglifyOptions: {
                    warning: "verbose",
                    ecma: 6,
                    beautify: false,
                    compress: false,
                    comments: false,
                    mangle: false,
                    toplevel: false,
                    keep_classnames: true,
                    keep_fnames: true,
                    drop_debugger: true,
                    drop_console: true
                    }
              }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            chunks: "all",   //initial、async和all
            minSize: 30000,   //形成一个新代码块最小的体积
            minChunks: 1,  //在分割之前，这个代码块最小应该被引用的次数
            maxAsyncRequests: 5,   //按需加载时候最大的并行请求数
            maxInitialRequests: 3,   //最大初始化请求数
            automaticNameDelimiter: '~',   //打包分割符
            name:'commons',
              //打包后的名字
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,   //用于控制哪些模块被这个缓存组匹配到、它默认会选择所有的模块
                    priority: -10,   //缓存组打包的先后优先级
                    name: 'vendors', 
                    minSize:3000
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    minSize:3000
                }
            }
        }
    },
	module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "env", "react"    //babel
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,{
                        loader:'css-loader',
                        options:{
                            modules:true,
                            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                        }
                }]
            }
        ]
    },
    plugins: [
        new DropConsoleWebpackPlugin(),
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/src/index.tmpl.html",//new 一个这个插件的实例，并传入相关的参数,
        }),
        new webpack.HashedModuleIdsPlugin(),  
        // new UglifyJsPlugin(/* ... */),     //已默认配置   js压缩
        // new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),  //已默认配置   定义变量
        // new webpack.optimize.ModuleConcatenationPlugin(),  //已默认配置  作用域(scope hoisting)提升 
        // new webpack.NoEmitOnErrorsPlugin()   //已默认配置   打包过程中报错不会退出 
        new CleanWebpackPlugin(['public']),
        new MiniCssExtractPlugin({
          filename: "[name]-[contenthash].css",
          chunkFilename: "[id].css"
        }),
        // new HelloWorldPlugin({drop_log: true,drop_error:true,drop_info:true,drop_warning:true}),
    ],
}

// console.log(process.env.NODE_ENV)


module.exports = Config
