# LAB40 – Laboratório de Funcionalidades Web

Projeto-base para avaliação prática de Integração e Entrega Contínua (CI/CD).

## Requisitos
- Node.js 20 ou superior.
- npm.

## Executar localmente
```bash
npm install
npm start
```
Acesse http://localhost:3000. Para desenvolvimento com reinicialização automática: `npm run dev`.

## Endpoints
- `GET /health`: verificação de disponibilidade.
- `GET /api/features`: lista as 40 funcionalidades e seus estados.
- `POST /api/features/:id`: executa uma funcionalidade, recebendo JSON no corpo.

Exemplo:
```bash
curl -X POST http://localhost:3000/api/features/1 -H "Content-Type: application/json" -d '{"valor":200,"percentual":15}'
```

## Estrutura
```text
lab40/
├── public/
├── src/
│   ├── app.js
│   ├── server.js
│   └── features/
├── package.json
└── package-lock.json
```

## Contrato de cada módulo
Cada arquivo `src/features/featureNN.js` exporta `id`, `name`, `description`, `implemented` e `execute(input)`.

1. Implemente `execute(input)`.
2. Valide os dados recebidos.
3. Retorne um objeto serializável em JSON.
4. Trate entradas inválidas lançando `Error` com mensagem clara.
5. Depois de implementar e validar, altere `implemented` para `true`.
6. Não altere o contrato dos outros módulos nem a API central sem autorização.

Enquanto `implemented` for `false`, a API retorna HTTP 501 para aquele módulo.

## Importante
Este repositório é entregue intencionalmente sem testes automatizados, análise estática, workflow de CI, build ou configuração de deploy. O estudante deverá criar e justificar esses elementos durante a avaliação.

O servidor escuta `process.env.PORT` e `0.0.0.0`, e a aplicação não persiste dados em disco.

<<<<<<< HEAD
---

## Entrega do estudante – Feature 05 (Conversor de medidas)

### Implementação
Arquivo: `src/features/feature05.js` (`implemented = true`).

- Entrada: `{ valor, origem, destino }` → saída: `{ resultado }`. Ex.: `{ valor: 2.5, origem: "km", destino: "m" }` → `{ resultado: 2500 }`.
- Unidades permitidas: `mm`, `cm`, `m`, `km`. **Padrão adotado:** a comparação ignora maiúsculas/minúsculas e espaços nas extremidades (`"KM"` = `"km"`).
- Validação: `valor` deve ser `number`, finito e não negativo; entradas ausentes, de tipo incorreto ou com unidade desconhecida lançam `Error` com mensagem clara (HTTP 400 na API).
- Cálculo: converte para uma unidade-base e depois para o destino. Usa fatores inteiros em milímetros (mm=1, cm=10, m=1000, km=1.000.000), equivalentes a mm=0,001 m; cm=0,01 m; m=1 m; km=1000 m.
- **Política de arredondamento:** resultado arredondado para 10 casas decimais, eliminando ruídos de ponto flutuante (ex.: 0,7 cm → 7 mm, e não 6.999999999999999).
- O objeto de entrada não é modificado.

### Scripts
| Comando | O que faz |
|---|---|
| `npm test` | Testes automatizados com `node:test` (`test/feature05.test.js`) |
| `npm run test:spec` | Testes com relatório detalhado |
| `npm run lint` | ESLint (`eslint.config.js`) |
| `npm run format:check` | Verifica formatação com Prettier (`npm run format` corrige) |
| `npm run test:smoke` | Sobe o servidor real e verifica `/health`, `/api/features` e `POST /api/features/5` (válido → 200, inválido → 400). Com `SMOKE_URL=http://host:porta` verifica um servidor já em execução |

Os arquivos-base do template (`src/app.js`, `src/server.js`, `src/features/index.js`, `public/`) ficam fora do Prettier (`.prettierignore`) para não alterar a API central sem autorização; eles continuam sendo verificados pelo ESLint.

### Testes
`test/feature05.test.js` cobre: caso típico (km→m, m→cm, cm→mm, mm→km), limites (valor 0, mesma unidade, maiúsculas, arredondamento) e entradas inválidas (negativo, unidade desconhecida, campos ausentes, strings, `NaN`, `Infinity`, entrada não objeto). Também verifica que a entrada não é alterada e que o módulo mantém o contrato.

### Auditoria de dependências
`npm audit --audit-level=high` → `found 0 vulnerabilities`. As dependências são apenas de desenvolvimento (eslint, @eslint/js, globals, prettier) e não entram na imagem Docker (`npm ci --omit=dev`).

### Docker
```bash
docker build --pull -t lab40:feature05 .
docker run -d --name lab40-container -p 3000:3000 lab40:feature05
curl --fail http://localhost:3000/health
curl --fail -X POST http://localhost:3000/api/features/5 -H "Content-Type: application/json" -d '{"valor":2.5,"origem":"km","destino":"m"}'
docker stop lab40-container && docker rm lab40-container
```

### CI (`.github/workflows/ci.yml`)
Executa em push para `main`/`feature/**` e em Pull Request para `main`: checkout → Node 22 → `npm ci` → formatação → lint → testes → smoke test → auditoria → build da imagem → container efêmero validando `/health` e a feature 05 → exportação da imagem (`.tar`) como artefato `lab40-docker-image`.

Requisito: Node.js 20.19+ (exigido pelo ESLint 10).
=======
exemplo
>>>>>>> c1a4691e036730a8dd77607da044fb740b8f5c40
