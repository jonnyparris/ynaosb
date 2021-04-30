module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    // Doesn't this go against the recommendation here: https://github.com/prettier/eslint-plugin-prettier#options? Yes, but with good reason:
    // This duplicates the settings in .prettierrc because the vscode eslint extension reads this file for on the fly lint highlighting
    // On the other hand, the vscode prettier extension (the one that actually autoformats) ignores this file and looks at .prettierrc
    // So...keep the .prettierrc around, and make sure it mirrors any prettier/prettier config options here otherwise you'll have an inconsitent experience
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        arrowParens: 'always',
        maxLen: { code: 100, ignoreUrls: true },
        printWidth: 100,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],
  },
}
