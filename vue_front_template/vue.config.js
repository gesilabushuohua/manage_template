const path = require('path');
module.exports = {
  publicPath: './',
  lintOnSave: false,
  pluginOptions: {
    'style-resources-loader': {
      patterns: [
        path.resolve(__dirname, 'src/assets/css/Variables.scss'),
      ],
      preProcessor: 'scss'
    }
  },
  configureWebpack: {
   
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
};
