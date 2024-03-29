const path = require('path');
const os = require('os');

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
const isProduction = process.env.NODE_ENV === 'production';

const TARGET_PLATFORM = (function(){
  let target = '';
  for (let i=0; i<process.argv.length; i++) {
    if (process.argv[i].includes('--platform=')) {
      target = process.argv[i].replace('--platform=', '');
      break;
    }
  }
  if (!['win32', 'darwin'].includes(target)) target = os.platform();
  return target;
})();

console.log(`TARGET_PLATFORM: ${TARGET_PLATFORM}`);

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname),
    '@app-info': path.resolve(__dirname, 'src/app-info'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@api': path.resolve(__dirname, 'src/api'),
    '@config': path.resolve(__dirname, 'src/config'),
    '@assets': path.resolve(__dirname, 'src/assets')
  };

  config.module.rules.unshift({
    test: /\.node$/,
    loader: 'native-ext-loader',
    options: {
      emit: true,
      // rewritePath: 'src/app/render/main-page/node_modules/trtc-electron-sdk/build/Release'
      rewritePath: process.env.NODE_ENV === 'production'
        ? TARGET_PLATFORM === 'win32'
          ? './resources/app.asar/node_modules/trtc-electron-sdk/build/Release'
          : '../Resources/app/node_modules/trtc-electron-sdk/build/Release'
        : 'src/app/render/main-page/node_modules/trtc-electron-sdk/build/Release'
    }
  });

  config.node = false;
  config.externals = {
    fs: "commonjs fs",
  };

  if (isProduction) {
    config.devtool = false;
  }

  return config;
}
