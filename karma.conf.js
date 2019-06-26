const webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: ['ChromeHeadless'],
    files: [
      'test/*/browser/**/*.test.ts'
    ],
    frameworks: ['mocha', 'karma-typescript'],
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
