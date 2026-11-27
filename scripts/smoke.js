// Smoke test: sobe o servidor real em uma porta livre e verifica os endpoints principais.
// Uso: npm run test:smoke
// Para testar um servidor já em execução (ex.: container Docker): SMOKE_URL=http://localhost:3000 npm run test:smoke
const { spawn } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");
const assert = require("node:assert/strict");

const TIMEOUT_MS = 10000;

function portaLivre() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function aguardarServidor(baseUrl) {
  const limite = Date.now() + TIMEOUT_MS;
  while (Date.now() < limite) {
    try {
      const res = await fetch(`${baseUrl}/health`);
      if (res.ok) return;
    } catch {
      // servidor ainda não aceita conexões
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Servidor não respondeu em ${TIMEOUT_MS} ms.`);
}

async function postFeature(baseUrl, id, body) {
  const res = await fetch(`${baseUrl}/api/features/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return { status: res.status, data: await res.json() };
}

async function verificar(baseUrl) {
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200, "GET /health deve responder 200");
  assert.equal((await health.json()).status, "ok", "GET /health deve indicar status ok");
  console.log("✔ GET /health → 200 { status: 'ok' }");

  const lista = await fetch(`${baseUrl}/api/features`);
  assert.equal(lista.status, 200, "GET /api/features deve responder 200");
  const catalogo = await lista.json();
  assert.equal(catalogo.items.length, 40, "catálogo deve conter 40 funcionalidades");
  const f05 = catalogo.items.find((item) => item.id === 5);
  assert.equal(f05?.implemented, true, "feature 05 deve estar implementada");
  console.log("✔ GET /api/features → 40 módulos, feature 05 implementada");

  const ok = await postFeature(baseUrl, 5, { valor: 2.5, origem: "km", destino: "m" });
  assert.equal(ok.status, 200, "POST /api/features/5 válido deve responder 200");
  assert.equal(ok.data.result.resultado, 2500, "2,5 km deve resultar em 2500 m");
  console.log("✔ POST /api/features/5 { 2.5 km → m } → 200 resultado 2500");

  const erro = await postFeature(baseUrl, 5, { valor: -1, origem: "m", destino: "cm" });
  assert.equal(erro.status, 400, "POST /api/features/5 inválido deve responder 400");
  assert.ok(erro.data.error, "resposta 400 deve conter mensagem de erro");
  console.log("✔ POST /api/features/5 { valor: -1 } → 400 com mensagem de erro");
}

async function main() {
  if (process.env.SMOKE_URL) {
    const baseUrl = process.env.SMOKE_URL.replace(/\/$/, "");
    await aguardarServidor(baseUrl);
    await verificar(baseUrl);
    return;
  }

  const port = await portaLivre();
  const baseUrl = `http://127.0.0.1:${port}`;
  const servidor = spawn(process.execPath, [path.join(__dirname, "..", "src", "server.js")], {
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "inherit", "inherit"]
  });
  let saiuAntes = null;
  servidor.on("exit", (code) => (saiuAntes = code));

  try {
    await aguardarServidor(baseUrl);
    if (saiuAntes !== null) throw new Error(`Servidor encerrou com código ${saiuAntes}.`);
    await verificar(baseUrl);
  } finally {
    servidor.kill();
  }
}

main()
  .then(() => console.log("Smoke test concluído com sucesso."))
  .catch((error) => {
    console.error(`✖ Smoke test falhou: ${error.message}`);
    process.exitCode = 1;
  });
