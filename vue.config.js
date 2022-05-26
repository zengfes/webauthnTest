// const proxy = require('http-proxy-middleware');
module.exports = {
    // devServer: {
    //   https: false,
    // }
    devServer: {
      proxy:{
        "/api": {
          target: 'http://10.20.1.97:8090/api/users',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/' 
          }
        }
      }
    }
}