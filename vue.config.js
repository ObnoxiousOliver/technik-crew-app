const { defineConfig } = require('@vue/cli-service')
const icons = require('./icons.json')
const fs = require('fs')

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    manifestOptions: {
      icons
    },

    name: 'Technik Crew App',
    themeColor: '#000000',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    iconPaths: {
      favicon: './public/img/icons/favicon.svg'
    }
  },
  configureWebpack: {
    devServer: {
      server: {
        type: 'spdy',
        options: {
          key: fs.readFileSync('./certs/localhost+1-key.pem'),
          cert: fs.readFileSync('./certs/localhost+1.pem'),
          ca: fs.readFileSync('C:\\Users\\Oliver\\AppData\\Local\\mkcert\\rootCA.pem')
        }
      }
    }
  }
})
