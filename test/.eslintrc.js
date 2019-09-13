const path = require('path');
console.log('dirName', __dirname)
console.log('in test lint file')
console.log('path.resolve', path.resolve(__dirname, "../tsconfig.json"))
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "airbnb-base"
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: [
            path.resolve(__dirname, "../tsconfig.json"),
          ]
        },
    plugins: [
        "@typescript-eslint"
    ],
    settings: {
        "import/extensions": [".js",".jsx",".ts",".tsx"],
        "import/parsers": {
          "@typescript-eslint/parser": [".ts",".tsx"]
         },
         "import/resolver": {
             "node": {
                 "extensions": [".js",".jsx",".ts",".tsx"]
             }
         }
    },
    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": "error",
        "func-style": "off",
        "space-before-function-paren": "off",
        "no-plusplus": "off",
        "no-nested-ternary": "off",
        "no-multi-assign": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "max-len": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/camelcase": "off",
        "camelcase": "off"
    }
}
