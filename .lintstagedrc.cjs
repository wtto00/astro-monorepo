module.exports = {
  '*': ['prettier --write --ignore-unknown'],
  '*.{js,mjs,jsx,ts,mts,tsx,vue}': ['eslint --color --fix'],
  '*.{ts,mts,tsx,vue}': [() => 'npm run tscheck'],
};
