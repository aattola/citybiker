module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  extends: [
    'next',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'turbo',
    'standard',
    'standard-jsx',
    'prettier'
  ],
  plugins: ['prettier', '@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/']
    }
  },
  rules: {
    'prettier/prettier': 'error',
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'react/default-props-match-prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/destructuring-assignment': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx', '.ts'] }],
    'react/jsx-no-bind': 'off',
    'react/no-array-index-key': 'off',
    'import/order': 'error',
    'react/prop-types': 'off',
    'turbo/no-undeclared-env-vars': 'off',

    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn' // Checks effect dependencies
  }
}
