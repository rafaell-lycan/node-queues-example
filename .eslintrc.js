module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ["eslint:recommended"],
  rules: {
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "no-case-declarations": "off",
    eqeqeq: "warn",
    "quote-props": ["warn", "consistent-as-needed"]
    "no-console": 0,
    "keyword-spacing": ["error"]
  }
};
