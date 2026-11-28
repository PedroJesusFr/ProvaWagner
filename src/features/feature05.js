// Funcionalidade 05: Conversor de medidas.
// Objetivo: Converte metros, centímetros e quilômetros.
// Exemplo de entrada: { valor: 2.5, origem: 'km', destino: 'm' }
// Regras: valor finito e não negativo; unidades permitidas: mm, cm, m, km.
// Caminho: converte para uma unidade-base e depois para o destino
// (mm = 0,001 m; cm = 0,01 m; m = 1 m; km = 1000 m).

const implemented = true;

// Fatores inteiros em milímetros: equivalentes aos fatores em metros,
// mas reduzem erros de ponto flutuante nas multiplicações/divisões.
const FATORES_EM_MM = Object.freeze({ mm: 1, cm: 10, m: 1000, km: 1000000 });

// Política de arredondamento: resultado arredondado para 10 casas decimais,
// eliminando ruídos de ponto flutuante (ex.: 0.00010000000000000002 → 0.0001).
const CASAS_DECIMAIS = 10;

// Padrão adotado: unidades comparadas sem diferenciar maiúsculas/minúsculas
// e ignorando espaços nas extremidades ("KM", " Km " → "km").
function normalizarUnidade(unidade) {
  if (typeof unidade !== "string") return null;
  const u = unidade.trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(FATORES_EM_MM, u) ? u : null;
}

// Valida a entrada e converte o valor entre as unidades informadas.
function execute(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Entrada inválida: informe um objeto com valor, origem e destino.");
  }

  const { valor, origem, destino } = input;

  if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0) {
    throw new Error("Valor deve ser um número finito e não negativo.");
  }

  const unidadeOrigem = normalizarUnidade(origem);
  const unidadeDestino = normalizarUnidade(destino);
  if (!unidadeOrigem || !unidadeDestino) {
    throw new Error("Unidades de origem e destino são obrigatórias e devem ser mm, cm, m ou km.");
  }

  const bruto = (valor * FATORES_EM_MM[unidadeOrigem]) / FATORES_EM_MM[unidadeDestino];
  const resultado = Number(bruto.toFixed(CASAS_DECIMAIS)) + 0; // "+ 0" evita -0

  return { resultado };
}

// Mantém o contrato de integração utilizado pela API central.
module.exports = {
  id: 5,
  name: "Conversor de medidas",
  description: "Converte metros, centímetros e quilômetros.",
  implemented,
  execute
};
