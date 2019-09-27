const eslint = require('./scripts/config/.eslintrc.js');
// // console.log('eslint', eslint)

module.exports = eslint;

// const path = require('path')

// module.exports = {
//   env: {
//     browser: true,
//     es6: true,
//     node: true
//   },
//   extends: [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/eslint-recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:@typescript-eslint/recommended-requiring-type-checking",
//     "airbnb-base"
//   ],
//   globals: {
//     Atomics: "readonly",
//     SharedArrayBuffer: "readonly"
//   },
//   parser: "@typescript-eslint/parser",
//   parserOptions: {
//     ecmaVersion: 2018,
//     sourceType: "module",
//     tsconfigRootDir: __dirname,
//     project: [
//       path.resolve(__dirname, "./tsconfig.json"),
//     ]
//   },
//   plugins: [
//     "@typescript-eslint"
//   ],
//   settings: {
//     "import/extensions": [".ts", ".tsx"],
//     "import/parsers": {
//       "@typescript-eslint/parser": [".ts", ".tsx"]
//     },
//     "import/resolver": {
//       "node": {
//         "extensions": [".ts", ".tsx"]
//       }
//     }
//   },
//   rules: {
//     "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
//     "@typescript-eslint/no-unused-vars": "error",
//     "@typescript-eslint/no-useless-constructor": "error",
//     "@typescript-eslint/unbound-method": "off",
//     "@typescript-eslint/no-inferrable-types": "off",
//     "class-methods-use-this": "off",
//     "comma-dangle": ["error", {
//       "arrays": "always-multiline",
//       "objects": "always-multiline",
//       "imports": "always-multiline",
//       "exports": "always-multiline",
//       "functions": "never"
//     }],
//     "func-style": "off",
//     "object-curly-newline": "off",
//     "max-len": ["error", { "code": 120 }],
//     "no-nested-ternary": "off",
//     "no-unused-vars": "off",
//     "no-param-reassign": ["error", { "props": false }],
//     "no-plusplus": "off",
//     "no-useless-constructor": "off",
//     "space-before-function-paren": ["error", {
//       "anonymous": "never",
//       "named": "always",
//       "asyncArrow": "always"
//     }]
//   }
// }
