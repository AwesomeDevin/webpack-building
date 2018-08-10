const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");   //css提取
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");   //css压缩
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')


module.exports = {
    mode: 'deveopment',
	entry: 	__dirname + "/src/index.js",
	output: {
		path:__dirname + "/public",
        filename: "[name]-[hash].bundle.js",
        chunkFilename: '[name].[chunkhash:5].chunk.js'
	},
	// devtool:'source-map',   //源码映射，便于调试
	devServer:{
		contentBase:'./public',   //设置本地服务器目录
		historyApiFallback:true,    //设置为true，所有的跳转将指向index.html
		inline:true, //实时刷新
		port:3000, //端口
	},
	optimization: {
        minimizer: [
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
                // use: [
                //     {
                //         loader: "style-loader"
                //     }, {
                //         loader: "css-loader",
                //         options: {
                //             modules: true, // 指定启用css modules
                //             localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                //         }
                //     },{
                //         loader: "postcss-loader"
                //     }

                // ]
                use:[MiniCssExtractPlugin.loader,'css-loader','postcss-loader']
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/src/index.tmpl.html",//new 一个这个插件的实例，并传入相关的参数,
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(),    //已默认配置
        // new webpack.NamedChunksPlugin(),   //已默认配置  
        // new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),  //已默认配置
        new CleanWebpackPlugin(['public']),   //清除旧的打包文件
        new MiniCssExtractPlugin({
          filename: "[name]-[contenthash].css",     //contenthash 代替hash 可保持css在js修改时hash值不发生改变
          chunkFilename: "[id].css"
        }),
    ],
}

