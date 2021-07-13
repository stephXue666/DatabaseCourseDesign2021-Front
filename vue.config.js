module.exports = {
    devServer: {
        proxy: { // 为天气接口配置代理，解决跨域
            '/baidu/': {
                target: 'http://api.map.baidu.com', //百度地图接口地址
                changeOrigin: true, // 跨域访问设置，true代表跨域
                pathRewrite: { // 路径改写规则
                    '^/baidu': '' // 以/proxy/为开头的改写为''
                }
            },
            '/zhunar/': {
                target: 'http://121.196.223.20:5000', //后端接口地址
                changeOrigin: true, // 跨域访问设置，true代表跨域
                pathRewrite: { // 路径改写规则
                    '^/zhunar': '' // 以/zhunar/为开头的改写为''
                }
            }
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