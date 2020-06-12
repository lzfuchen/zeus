module.exports = {
    root: true,
    "env": {
        "es2020": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:prettier/recommended"
    ],
    "parserOptions": {
        parser: "babel-eslint",
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "prettier/prettier": "error",
    }
};
