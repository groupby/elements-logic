const webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: ['ChromeHeadless'],
    files: [
      'test/setup.ts',
      'test/unit/common/**/*.test.ts',
      'test/unit/browser/**/*.test.ts',
    ],
    frameworks: ['mocha', 'chai', 'sinon', 'karma-typescript'],
    reporters: ['mocha', 'karma-typescript'],
    karmaTypescriptConfig: {
      compilerOptions: {
        module: "commonjs"
      },
      tsconfig: "./tsconfig.json"
    },
    preprocessors: {
      '**/*.ts': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity,
    port: 9876,
    logLevel: config.LOG_INFO,
    colors: true,
  })
}
