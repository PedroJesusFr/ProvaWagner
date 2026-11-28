// Configuração do ESLint (formato "flat config").
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  { ignores: ["node_modules/**", "coverage/**"] },
  js.configs.recommended,
  {
    // Código do servidor, módulos, testes e scripts: CommonJS em Node.js.
    files: ["**/*.js"],
    ignores: ["public/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node }
    }
  },
  {
    // Interface web: script executado no navegador.
    files: ["public/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser }
    }
  }
];
