
module.exports = {
  "env": {
    "amd": true,
    "browser": true,
    "es6": true,
  },
  "extends": "eslint:recommended",
  "rules": {
    "eqeqeq": [
      "error",
      "always"
    ],
    "keyword-spacing": [
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-extra-semi": [
      "error"
    ],
    "no-mixed-spaces-and-tabs": [
      "error"
    ],
    "semi": [
      "error",
      "always"
    ],
    "space-before-blocks": [
      "error",
      "always"
    ],
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "named": "never"
      }
    ],
    "space-in-parens": [
      "error",
      "never"
    ],
    "space-infix-ops": [
      "error"
    ]
  }
};
