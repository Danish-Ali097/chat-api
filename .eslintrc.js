module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "eqeqeq": "error", // enforce the use of === and !==
        "curly": "error", // require curly braces for all control statements
        "no-console": "warn", // disallow the use of console
        "no-debugger": "warn", // disallow the use of debugger
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // disallow unused variables except those starting with an underscore
        "@typescript-eslint/explicit-function-return-type": "off", // do not require explicit return types on functions
        "@typescript-eslint/no-explicit-any": "off" // do not disallow usage of the any type 
    }
}
