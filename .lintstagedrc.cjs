module.exports = {
  '*': ['prettier --write --ignore-unknown'],
  '*.{js,mjs,jsx,ts,mts,tsx,astro}': ['eslint --cache --fix'],
  '*.{ts,mts,tsx,astro}': [() => 'npm run check'],
}
