const { defineConfig } = require('@vue/cli-service')
const icons = require('./icons.json')

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
})
