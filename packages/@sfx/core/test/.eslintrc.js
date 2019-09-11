const eslintConfig = require('../../../../.eslintrc.js');

module.exports = {
    ...eslintConfig,
    parserOptions: {
        project: [
            "./tsconfig.json"
        ]
    },
    rules: {
        "no-multi-assign": "off"
    }
}