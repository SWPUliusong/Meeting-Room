// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // 选项...
  devServer: {
    https: true,
    proxy: {
      '/peer-to-peer': {
        target: 'https://192.168.31.252:3000/',
        ws: true,
        changeOrigin: true
      },
      "/api": {
        target: 'https://192.168.31.252:3000/',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }
    }
  }
}