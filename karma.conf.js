// Karma configuration
// Generated on Wed Jun 19 2019 16:47:19 GMT-0400 (EDT)

const webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    autoWatch: true,
    basePath: '',
    browsers: ['ChromeHeadless'],
    colors: true,
    concurrency: Infinity,
    files: [
      'test/*/browser/**/*.test.ts'
    ],
    frameworks: ['mocha', 'karma-typescript'],
    karmaTypescriptConfig: {
      compilerOptions: {
          module: "commonjs"
      },
      tsconfig: "./tsconfig.json"
    },
    logLevel: config.LOG_INFO,
    port: 9876,
    preprocessors: {
      '**/*.ts': ['webpack']
    },
    reporters: ['mocha', 'karma-typescript'],
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
  })
}
