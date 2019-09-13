console.log('in global eslint')
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
        project: [
            "./tsconfig.json",
            "./packages/**/tsconfig.json"
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
        "no-param-reassign": ["error", { "props": true }],
        "no-plusplus": "off",
        "no-nested-ternary": "off",
        "comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "never"
    }],
        "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
        "@typescript-eslint/unbound-method": "off",
        "class-methods-use-this": "off",
    }
}