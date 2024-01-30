let config = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:node/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {},
  plugins: ["prettier"],
};
module.exports = config;
