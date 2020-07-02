const config = require('./common/production.common.config');
module.exports = {
  entry: {
    'summernote-lite': './src/js/lite/settings',
    'summernote-lite.min': './src/js/lite/settings',
    ...config.entries,
  },
  optimization: config.optimization,
  output: config.output,
  externals: config.externals,
  devtool: config.devtool,
  module: config.module,
  plugins: config.plugins,
};
