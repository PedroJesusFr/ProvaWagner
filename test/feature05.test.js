// Testes – Feature 05 (Conversor de medidas)
// Execute com: node --test test/feature05.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const feature = require("../src/features/feature05");

// --- Testes de referência (caderno de testes) ---
test("converte km para m", () => {
  assert.equal(feature.execute({ valor: 2.5, origem: "km", destino: "m" }).resultado, 2500);
});
test("converte m para cm e cm para mm", () => {
  assert.equal(feature.execute({ valor: 1.2, origem: "m", destino: "cm" }).resultado, 120);
  assert.equal(feature.execute({ valor: 3, origem: "cm", destino: "mm" }).resultado, 30);
});
test("converte mm para km e aceita zero", () => {
  assert.equal(feature.execute({ valor: 1000000, origem: "mm", destino: "km" }).resultado, 1);
  assert.equal(feature.execute({ valor: 0, origem: "m", destino: "km" }).resultado, 0);
});
test("rejeita valor negativo e unidade desconhecida", () => {
  assert.throws(() => feature.execute({ valor: -1, origem: "m", destino: "cm" }), {
    name: "Error"
  });
  assert.throws(() => feature.execute({ valor: 1, origem: "milha", destino: "m" }), {
    name: "Error"
  });
});

// --- Testes complementares ---
test("retorna objeto com a propriedade resultado (contrato)", () => {
  assert.deepEqual(feature.execute({ valor: 2.5, origem: "km", destino: "m" }), {
    resultado: 2500
  });
});
test("mesma unidade de origem e destino devolve o próprio valor", () => {
  assert.equal(feature.execute({ valor: 7.5, origem: "cm", destino: "cm" }).resultado, 7.5);
});
test("unidades sem diferenciar maiúsculas/minúsculas", () => {
  assert.equal(feature.execute({ valor: 2.5, origem: "KM", destino: "M" }).resultado, 2500);
  assert.equal(feature.execute({ valor: 1, origem: " Km ", destino: "cM" }).resultado, 100000);
});
test("arredondamento elimina ruído de ponto flutuante", () => {
  assert.equal(feature.execute({ valor: 0.1, origem: "m", destino: "km" }).resultado, 0.0001);
  assert.equal(feature.execute({ valor: 0.3, origem: "cm", destino: "m" }).resultado, 0.003);
});
test("não modifica o objeto de entrada", () => {
  const input = Object.freeze({ valor: 2.5, origem: "KM", destino: "m" });
  const copia = { ...input };
  feature.execute(input);
  assert.deepEqual(input, copia);
});
test("rejeita entradas ausentes, tipos incorretos e não finitos com mensagem clara", () => {
  for (const input of [
    undefined,
    null,
    [],
    "texto",
    {},
    { origem: "m", destino: "cm" },
    { valor: 1, destino: "cm" },
    { valor: 1, origem: "m" },
    { valor: "10", origem: "m", destino: "cm" },
    { valor: NaN, origem: "m", destino: "cm" },
    { valor: Infinity, origem: "m", destino: "cm" },
    { valor: 1, origem: "m", destino: "pol" },
    { valor: 1, origem: 1, destino: "cm" },
    { valor: 1, origem: "toString", destino: "m" }
  ]) {
    assert.throws(
      () => feature.execute(input),
      (err) => err instanceof Error && err.message.length > 0
    );
  }
});
test("módulo exporta metadados e implemented=true", () => {
  assert.equal(feature.id, 5);
  assert.equal(feature.implemented, true);
  assert.equal(typeof feature.name, "string");
  assert.equal(typeof feature.description, "string");
});
