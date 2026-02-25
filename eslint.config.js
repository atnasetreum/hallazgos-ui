const nextConfig = require("eslint-config-next");

module.exports = [
  ...nextConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
];
