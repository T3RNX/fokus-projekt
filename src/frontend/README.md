[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=bugs)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=T3RNX_fokus-projekt&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=T3RNX_fokus-projekt)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
