const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: {
    core: path.resolve(__dirname, 'presets/core.ts'),
    'all-plugins': path.resolve(__dirname, 'presets/all-plugins.ts'),
  },

  devtool: 'source-map',

  output: {
    filename: 'sfx-[name]-bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [new webpack.ProgressPlugin()],

  module: {
    rules: [{
      test: path.resolve(__dirname, 'presets', 'core.ts'),
      use: { loader: 'expose-loader', options: 'sfxCore' }
    },
    {
      test: path.resolve(__dirname, 'presets', 'plugins.ts'),
      use: { loader: 'expose-loader', options: 'sfxPlugins' }
    },
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: [/node_modules/]
    }]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },

  devServer: {
    open: true
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}
