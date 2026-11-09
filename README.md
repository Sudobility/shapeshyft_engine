# @sudobility/shapeshyft_engine

Stateless LLM structured-output engine shared by ShapeShyft (`shapeshyft_api`)
and ShapeRouter (`shaperouter_api`, via `@sudobility/shapeshyft_service`).

It turns a prompt plus a JSON output schema into a structured response across
twelve LLM providers behind one interface. It is deliberately **stateless**: no
database, no HTTP framework, and no environment reads — callers pass every
credential and option in. Provider SDKs (`openai`, `@anthropic-ai/sdk`,
`@google/generative-ai`, `groq-sdk`) and `sharp` are **optional peer
dependencies**, so a consumer installs only the ones it uses.

Supported providers: `openai`, `anthropic`, `gemini`, `mistral`, `cohere`,
`groq`, `xai`, `deepseek`, `perplexity`, `lm_studio`, `jev`, `openrouter`
(Mistral, xAI, DeepSeek, Perplexity, Cohere, and OpenRouter run through the
OpenAI-compatible adapter with their own base URLs).

## Entry points

The package ships three ESM entry points (`type: module`, Node `NodeNext`):

| Import | Contents | Runtime safety |
| --- | --- | --- |
| `@sudobility/shapeshyft_engine` | Full engine: `createLLMProvider`, provider adapters, provider/model catalog (`config/providers`), prompt builder, `ApiHelper`, media handling, capability validation, cost estimation. | Node (uses provider SDKs, `sharp`, `Buffer`). |
| `@sudobility/shapeshyft_engine/core` | Pure request/response half: `buildProviderRequest`, `parseProviderResponse`, body builders (`buildOpenAIChatBody`, `buildAnthropicMessagesBody`), `PROVIDER_ENDPOINTS`, `parseModelJson`. | React Native / browser safe — no SDK, no `sharp`, no `Buffer`/`process`/`node:*`. |
| `@sudobility/shapeshyft_engine/types` | Product-neutral domain types and pure helpers. Re-exported by `shapeshyft_types` / `shaperouter_types`. | No runtime imports at all. |

## Install

Published to **GitHub Packages** under the `@sudobility` scope. Consumers need
the scope pointed at that registry (see `.npmrc`):

```
@sudobility:registry=https://npm.pkg.github.com
```

```sh
bun add @sudobility/shapeshyft_engine
# install the provider SDK(s) you use, e.g.:
bun add openai @anthropic-ai/sdk
```

## Usage

```ts
import { createLLMProvider } from "@sudobility/shapeshyft_engine";
import type { LLMRequest } from "@sudobility/shapeshyft_engine";

const provider = createLLMProvider("openai", { apiKey: process.env.OPENAI_KEY });

const request: LLMRequest = {
  prompt: "Extract the invoice total and currency.",
  outputSchema: {
    type: "object",
    properties: {
      total: { type: "number" },
      currency: { type: "string" },
    },
    required: ["total", "currency"],
  },
};

const result = await provider.generate(request);
console.log(result.content); // parsed structured object
console.log(result.usage, result.finishReason);
```

Need the request body without sending it (RN/browser)? Use the `/core` entry:

```ts
import { buildProviderRequest, parseProviderResponse } from "@sudobility/shapeshyft_engine/core";
```

## Develop

Requires [Bun](https://bun.sh) (the project is a standalone Bun package, not part
of a workspace — see `bunfig.toml`).

```sh
bun install
bun run verify   # typecheck + lint + test:unit + build — the canonical gate
```

Individual scripts (from `package.json`):

| Command | What it does |
| --- | --- |
| `bun run build` | Compile ESM + `.d.ts` to `dist/` (`tsc -p tsconfig.esm.json`). |
| `bun run clean` | `rm -rf dist`. |
| `bun run typecheck` | `tsc --noEmit`. |
| `bun run lint` / `bun run lint:fix` | ESLint over `src/`. |
| `bun run format` / `bun run format:check` | Prettier over `src/` and `tests/`. |
| `bun run test:unit` | Build, then run the Vitest suite once. |
| `bun run test:watch` | Vitest in watch mode. |
| `bun run verify` | Full gate (also runs via `prepublishOnly`). |

Tests live in `tests/` (`tests/unit/*` plus `tests/package/node-esm.test.ts`,
which imports the built `dist/` under plain Node ESM). Several unit tests are
architectural guards: `core-no-runtime-deps.test.ts` keeps `/core` SDK- and
Node-free, and `types-no-runtime-imports.test.ts` keeps `/types` import-free.

## Source layout

```
src/
  index.ts            full-engine barrel
  config/providers.ts provider + model catalog, pricing, capabilities
  core/               pure request/response half (RN-safe entry)
  lib/                prompt builder, ApiHelper, media, cost, limits
  services/llm/       provider adapters + JSON repair, finish-reason mapping
  types/index.ts      domain types (types entry)
```

## Newcomer essentials

- **Relative imports must carry `.js`** (`NodeNext` resolution) or the compiler
  rejects them.
- **Credentials come in via `ProviderConfig`**; the engine never looks them up
  from the environment.
- One body per provider family: SDK adapters and `buildApiPayload()` send the
  body `core/payload.ts` builds, so what `/prompt` describes is what the call
  sends. Provider quirks live in `openAIChatDialect(provider)`.
- Model output JSON is parsed tolerantly — strict `JSON.parse` runs first, and
  only text it rejects reaches `readModelJson` (`services/llm/json-repair.ts`),
  which repairs common malformations and logs every fix.
- CI/CD (`.github/workflows/ci-cd.yml`) publishes to GitHub Packages on push to
  `main`/`develop` via the shared `johnqh/workflows` unified pipeline.

License: BUSL-1.1.
