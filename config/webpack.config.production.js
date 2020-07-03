const config = require('./common/production.common.config');
module.exports = {
  entry: {
    'summernote': './src/js/ui/settings',
    'summernote.min': './src/js/ui/settings',
    ...config.entries,
  },
  optimization: config.optimization,
  output: config.output,
  externals: config.externals,
  devtool: config.devtool,
  module: config.module,
  plugins: config.plugins,
};
