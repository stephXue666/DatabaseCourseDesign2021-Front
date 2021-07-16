const BaseUrl = require("./src/config.js");

module.exports = {
    publicPath: './',
    devServer: {
        proxy: { // 为接口配置代理，解决跨域
            [BaseUrl.ZHUNAR]: {
                target: BaseUrl.URL, // 通过本地服务器将你的请求转发到这个地址
                changeOrigin: true, // 设置这个参数可以避免跨域
                pathRewrite: {
                    ['^${BaseUrl.ZHUNAR}']: '',
                    '^/zhunar': '',
                }
            },
            /*[BaseUrl.BAIDU]: {
                target: BaseUrl.URL1, // 通过本地服务器将你的请求转发到这个地址
                changeOrigin: true, // 设置这个参数可以避免跨域
                pathRewrite: {
                    ['^${BaseUrl.BAIDU}']: '',
                    '^/baidu': '',
                }
            },*/
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        externals: {
            'BMap': 'BMap',
        },
    }
}