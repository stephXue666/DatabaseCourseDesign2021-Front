//后台接口域名
let URL = "http://121.196.223.20:5000"

let ZHUNAR
//由于封装的axios请求中，会将ZHUNAR打包进去，为了方便之后不再更改，判断了当前环境，而生成的不同的ROOT
if (process.env.NODE_ENV === "development") {
    //开发环境下的代理地址，解决本地跨域跨域，配置在vue.config.js里
    ZHUNAR = "/zhunar"
} else {
    //生产环境下的地址
    ZHUNAR = URL
}

exports.URL = URL//代理指向地址
exports.ZHUNAR = ZHUNAR