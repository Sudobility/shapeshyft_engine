/**
 * LLM Provider and Model Configuration
 *
 * This configuration is served via API endpoints so it can be updated
 * without requiring frontend package updates.
 *
 * ## Supported Providers
 *
 * Catalog verified against provider documentation on 2026-08-18; pricing
 * re-verified against each provider's pricing page on 2026-09-14.
 *
 * - **openai**: GPT-5.6 (Sol/Terra/Luna), GPT-5.5, GPT-5.4, GPT-5, GPT-4.1, GPT-4o; GPT Image 2.5 (flare/sunburst), GPT Image 2
 * - **anthropic**: Claude Fable 5, Opus 5, Sonnet 5, Haiku 4.5 (+ Opus 4.8/4.7/4.6, Sonnet 4.6)
 * - **gemini**: Gemini 3.7/3.6/3.5/3.1 and 2.5, Nano Banana image models, Veo 3.1 video
 * - **mistral**: Mistral Large 3, Medium 3.5, Small 4, Ministral 3, Codestral
 * - **cohere**: Command A+, Command A (reasoning/vision/translate), Command R
 * - **groq**: GPT-OSS, Qwen3.6, MiniMax M2.7, Compound, Whisper
 * - **xai**: Grok 4.6, 4.5, 4.3, Grok 4.20 variants, Grok Build
 * - **deepseek**: DeepSeek V4.1 Flash and V4 Pro
 * - **perplexity**: Sonar models with live web search grounding
 * - **lm_studio**: Local LLM server (LM Studio or any OpenAI-compatible endpoint)
 * - **openrouter**: OpenRouter, an OpenAI-compatible router. Model ids are
 *   free-form `vendor/model`; pricing is looked up by the part after the slash
 *   (the vendor's own id), since OpenRouter passes vendor prices through.
 * - **jev**: TypeSafe AI's Jev, a "System One" model. Text-only, no free-form
 *   generation -- see the Jev section below before assuming it behaves like
 *   the providers above.
 *
 * ## Keeping this current
 *
 * Model lineups turn over every few weeks and retired IDs fail at the provider,
 * not here -- `MODEL_CAPABILITIES` and `MODEL_PRICING` fall back to permissive
 * defaults for anything unknown, so a stale entry surfaces as a runtime error in
 * a user's endpoint. When updating, work from each provider's own model and
 * pricing pages (linked above each section below), and check the provider's
 * deprecation page for retirements: Groq retired `llama-3.3-70b-versatile` and
 * `llama-3.1-8b-instant` on 2026-08-16, and both were listed here until then.
 *
 * Pricing is in **cents per 1M tokens** (image per image, audio/video per minute).
 * `estimateUsageCost` (`lib/cost-estimation.ts`) prices a call from these rates
 * plus the optional refinements on `ModelPricing`: cached and audio input,
 * long-context tiers, peak hours, and per-request and per-search fees. A rate a
 * provider does not publish is left out rather than guessed.
 *
 * ## LM Studio Model Identifiers
 *
 * LM Studio uses the OpenAI-compatible API format. When specifying models:
 *
 * - **API requests** use just the model name (e.g., `"qwen2.5-vl-7b-instruct"`)
 * - **Downloading models** uses publisher/name format (e.g., `lmstudio-community/Qwen2.5-VL-7B-Instruct-GGUF`)
 *
 * The model identifier in API requests matches what's returned by `GET /v1/models`.
 * Example response:
 * ```json
 * { "id": "qwen2.5-vl-7b-instruct", "object": "model" }
 * ```
 *
 * To discover available models on a running LM Studio server:
 * ```bash
 * curl http://localhost:1234/v1/models
 * ```
 *
 * For multi-variant models, you can specify quantization with `@`:
 * ```
 * google/gemma-3-12b@q3_k_l
 * google/gemma-3-12b@4bit
 * ```
 *
 * ## Vision Models
 *
 * Vision-capable models can process images in addition to text:
 * - Qwen2.5-VL series: Excellent object recognition, 128k context window
 * - Gemma 3 series: Google's multimodal models
 * - GLM-4V: Optimized for local deployment
 * - Pixtral: Mistral's vision model
 * - olmOCR: Specialized for OCR tasks
 * - Janus-Pro: Visual QA and scene interpretation
 *
 * Note: Vision models are not optimal for text-only tasks. For text-only
 * workloads, use dedicated text models like Qwen3 or Mistral.
 *
 * @see https://lmstudio.ai/docs/developer/openai-compat
 * @see https://lmstudio.ai/docs/developer/openai-compat/models
 *
 * ## Jev (TypeSafe AI)
 *
 * Jev does not generate free-form text or arbitrary JSON: it answers
 * pre-declared Choice (pick one of up to 255 options), Score (a 2-10 level
 * ordered rubric), or Noul (yes/no probability) questions, evaluated in
 * parallel. `services/llm/jev.ts` maps an endpoint's `outputSchema` onto these
 * primitives one top-level property at a time:
 *
 * - `{ type: "boolean" }` -> Noul
 * - `{ type: "string", enum: [...] }` -> Choice (enum values become options)
 * - `{ type: "string", enum: [...], "x-jev-kind": "score" }` -> Score (the
 *   enum, in order, becomes the rubric's levels from low to high)
 *
 * Any other field shape (free text, numbers, arrays, nested objects) is
 * incompatible with Jev and fails with a validation error naming the field --
 * there is no fallback that stringifies or guesses at unsupported types.
 * Confirmed against https://docs.typesafe.ai on 2026-09-23; verify against the
 * same docs before trusting model IDs or pricing here after that date, since
 * TypeSafe shipped this model days before that verification and jev-1.13 was
 * still described as having "rough edges".
 *
 * @see https://docs.typesafe.ai/api.md
 * @see https://docs.typesafe.ai/primitives.md
 */

import type {
  LlmProvider,
  ModelCapabilities,
  ModelPricing,
  ProviderConfig,
} from "../types/index.js";

// =============================================================================
// Provider Configuration
// =============================================================================

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    description:
      "GPT-5.6 (Sol, Terra, Luna), GPT-5.5, GPT-5.4, GPT-4.1 models; GPT Image 2.5 / 2 image generation",
    allowsCustomModel: false,
    defaultModel: "gpt-5.6-terra",
    requiresEndpointUrl: false,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude Fable 5, Opus 5, Sonnet 5, Haiku 4.5 models",
    allowsCustomModel: false,
    defaultModel: "claude-sonnet-5",
    requiresEndpointUrl: false,
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description:
      "Gemini 3.7, 3.6, 3.5, 3.1 and 2.5 models, plus Nano Banana image models",
    allowsCustomModel: false,
    defaultModel: "gemini-3.7-flash",
    requiresEndpointUrl: false,
  },
  {
    id: "mistral",
    name: "Mistral AI",
    description:
      "Mistral Large 3, Medium 3.5, Small 4, Ministral 3, Codestral models",
    allowsCustomModel: false,
    defaultModel: "mistral-medium-latest",
    requiresEndpointUrl: false,
  },
  {
    id: "cohere",
    name: "Cohere",
    description: "Command A+, Command A, Command R models",
    allowsCustomModel: false,
    defaultModel: "command-a-plus-05-2026",
    requiresEndpointUrl: false,
  },
  {
    id: "groq",
    name: "Groq",
    description:
      "Fast inference with GPT-OSS, Qwen, MiniMax, Compound, and Whisper",
    allowsCustomModel: false,
    defaultModel: "openai/gpt-oss-120b",
    requiresEndpointUrl: false,
  },
  {
    id: "xai",
    name: "xAI",
    description: "Grok 4.6, 4.5, 4.3 and Grok Build models",
    allowsCustomModel: false,
    defaultModel: "grok-4.6",
    requiresEndpointUrl: false,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "DeepSeek V4.1 Flash and V4 Pro models",
    allowsCustomModel: false,
    defaultModel: "deepseek-flash",
    requiresEndpointUrl: false,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "Sonar models with live web search grounding",
    allowsCustomModel: false,
    defaultModel: "sonar",
    requiresEndpointUrl: false,
  },
  {
    id: "lm_studio",
    name: "LM Studio / Custom",
    description: "Local LLM server or custom OpenAI-compatible endpoint",
    allowsCustomModel: true,
    defaultModel: "qwen3-8b",
    requiresEndpointUrl: true,
  },
  {
    id: "jev",
    name: "Jev (TypeSafe AI)",
    description:
      "Structured decisions (Choice/Score/Noul), not free-form text -- only endpoints whose fields are booleans or enums are compatible",
    allowsCustomModel: false,
    defaultModel: "jev-latest",
    requiresEndpointUrl: false,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    description:
      "One OpenAI-compatible API in front of many vendors; any vendor/model id OpenRouter lists",
    allowsCustomModel: true,
    defaultModel: "openai/gpt-5.6-terra",
    requiresEndpointUrl: false,
  },
];

// =============================================================================
// Models per Provider
// =============================================================================

export const PROVIDER_MODELS: Record<LlmProvider, string[]> = {
  openai: [
    // GPT-5.6 family (July 2026) - 1.05M context
    "gpt-5.6-sol",
    "gpt-5.6-terra",
    "gpt-5.6-luna",
    // GPT-5.5 / 5.4
    "gpt-5.5",
    "gpt-5.4",
    "gpt-5.4-mini",
    "gpt-5.4-nano",
    // GPT-5
    "gpt-5",
    "gpt-5-mini",
    "gpt-5-nano",
    // GPT-4 family
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "gpt-4o",
    "gpt-4o-mini",
    // Image generation. gpt-image-2 (Apr 2026) and gpt-image-2.5 (Sep 2026)
    // supersede gpt-image-1 (which deprecates 2026-10-23). 2.5 ships as two
    // snapshots at the same price: -flare (default, fast, high-volume) and
    // -sunburst (flagship, best editing/reference precision). The bare
    // "gpt-image-2.5" id is NOT callable — use a snapshot.
    "gpt-image-2.5-sunburst",
    "gpt-image-2.5-flare",
    "gpt-image-2",
    "gpt-image-1",
  ],
  anthropic: [
    // Current generation
    "claude-fable-5",
    "claude-opus-5",
    "claude-sonnet-5",
    "claude-haiku-4-5",
    // Still available, superseded
    "claude-opus-4-8",
    "claude-opus-4-7",
    "claude-opus-4-6",
    "claude-sonnet-4-6",
    "claude-opus-4-5-20251101",
    "claude-sonnet-4-5-20250929",
  ],
  gemini: [
    // Gemini 3 series (stable)
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    // Preview
    "gemini-3.1-pro-preview",
    "gemini-3-flash-preview",
    // Image generation (Nano Banana)
    "gemini-3.1-flash-image",
    "gemini-3.1-flash-lite-image",
    "gemini-3-pro-image",
    // Gemini 2.5 series
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash-image",
    "gemini-2.5-flash-native-audio-preview-12-2025",
    // Video generation
    "veo-3.1-generate-preview",
    "veo-3.1-lite-generate-preview",
  ],
  mistral: [
    "mistral-large-latest",
    "mistral-large-2512",
    "mistral-medium-latest",
    "mistral-small-latest",
    "mistral-small-2603",
    "ministral-14b-2512",
    "ministral-8b-2512",
    "ministral-3b-2512",
    "codestral-latest",
    "codestral-2508",
    // No OCR model: Mistral serves OCR only at /v1/ocr, never chat completions.
  ],
  cohere: [
    "command-a-plus-05-2026",
    "command-a-03-2025",
    "command-a-reasoning-08-2025",
    "command-a-vision-07-2025",
    "command-a-translate-08-2025",
    "command-r7b-12-2024",
    "command-r-plus-08-2024",
    "command-r-08-2024",
  ],
  groq: [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.6-27b",
    "minimaxai/minimax-m2.7",
    "groq/compound",
    "groq/compound-mini",
    // Audio transcription (two-stage pipeline with transcription_extraction_model)
    "whisper-large-v3",
    "whisper-large-v3-turbo",
  ],
  xai: [
    "grok-4.6",
    "grok-4.5",
    "grok-4.3",
    "grok-4.20-0309-reasoning",
    "grok-4.20-0309-non-reasoning",
    "grok-4.20-multi-agent-0309",
    "grok-build-0.1",
  ],
  deepseek: [
    "deepseek-flash", // V4.1 Flash (2026-09-10)
    "deepseek-v4-pro",
    // Retired V4 Flash ID; DeepSeek currently serves it with V4.1 Flash
    "deepseek-v4-flash",
  ],
  perplexity: [
    "sonar",
    "sonar-pro",
    "sonar-pro-search",
    "sonar-reasoning-pro",
    "sonar-deep-research",
  ],
  /**
   * LM Studio Model Identifiers
   *
   * IMPORTANT: LM Studio API uses just the model name as the identifier, NOT the
   * full publisher/model path used for downloading models.
   *
   * - Download format: `lmstudio-community/Qwen2.5-VL-7B-Instruct-GGUF`
   * - API request format: `qwen2.5-vl-7b-instruct`
   *
   * These identifiers match what's returned by `GET /v1/models` on your LM Studio server.
   * If you have different models loaded, you can use `allowsCustomModel: true` to enter
   * any model name, or query your server directly: `curl http://localhost:1234/v1/models`
   *
   * Multi-model loading: LM Studio supports loading multiple models simultaneously
   * (since v0.2.17). You can have both text and vision models loaded at once.
   */
  lm_studio: [
    // -------------------------------------------------------------------------
    // Text Models - Use for text-only tasks (faster, lower memory)
    // -------------------------------------------------------------------------
    "qwen3-8b", // Qwen3 8B - excellent general purpose
    "qwen3-14b", // Qwen3 14B - better reasoning
    "qwen3-30b-a3b", // Qwen3 30B MoE (3B active) - efficiency sweet spot
    "qwen2.5-coder-14b-instruct", // Code-specialized
    "mistral-7b-instruct-v0.3", // Fast, good for simple tasks
    "deepseek-r1-distill-qwen-7b", // Reasoning-focused
    // -------------------------------------------------------------------------
    // Vision Models - Process images + text (higher memory, slower)
    // -------------------------------------------------------------------------
    // Google Gemma 3 - state-of-the-art multimodal from Google
    "gemma-3-4b-it", // Lightweight vision
    "gemma-3-12b-it", // Balanced
    "gemma-3-27b-it", // Best quality
    // Qwen2.5-VL - excellent object recognition, 128k context window
    "qwen2.5-vl-3b-instruct", // Lightweight
    "qwen2.5-vl-7b-instruct", // Recommended for most use cases
    "qwen2.5-vl-32b-instruct", // High quality
    "qwen2.5-vl-72b-instruct", // Best quality (requires significant VRAM)
    // Other vision models
    "glm-4v-9b", // GLM-4V - optimized for local deployment
    "pixtral-12b-2409", // Mistral's vision model
    "olmocr-2-7b-1025", // olmOCR 2 - specialized for OCR (Oct 2025)
    "janus-pro-7b", // DeepSeek Janus-Pro - visual QA, scene interpretation
  ],
  // Jev (TypeSafe AI) -- https://docs.typesafe.ai/models
  // Aliases move when a new release ships; jev-1.13.0 pins the current one.
  jev: ["jev-latest", "jev-preview", "jev-1.13.0"],
  // OpenRouter -- https://openrouter.ai/models. Suggestions only: any
  // `vendor/model` id it lists is accepted (allowsCustomModel).
  openrouter: [
    "openai/gpt-5.6-terra",
    "anthropic/claude-sonnet-5",
    "deepseek/deepseek-v4-pro",
  ],
};

// =============================================================================
// Model Capabilities
// =============================================================================

export const MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  // OpenAI — https://developers.openai.com/api/docs/models
  "gpt-5.6-sol": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-5.6-terra": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-5.6-luna": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-5.5": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-5.4": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-5.4-mini": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-5.4-nano": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-5": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-5-mini": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-5-nano": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-4.1": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-4.1-mini": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-4.1-nano": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-4o": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "gpt-4o-mini": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  // Image generation. visionInput covers reference images sent to the
  // images/edits endpoint. shapeshyft_api's image-provider sends base64 only.
  "gpt-image-1": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: true,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  // gpt-image-2 / gpt-image-2.5 share gpt-image-1's shape: reference images in
  // via images/edits (visionInput), base64 image out. 2.5 accepts up to 16
  // reference images per call.
  "gpt-image-2": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: true,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "gpt-image-2.5-flare": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: true,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "gpt-image-2.5-sunburst": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: true,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },

  // Anthropic — https://platform.claude.com/docs/en/about-claude/models/overview
  "claude-fable-5": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "claude-opus-5": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "claude-sonnet-5": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "claude-haiku-4-5": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "claude-opus-4-8": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "claude-opus-4-7": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "claude-opus-4-6": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "claude-sonnet-4-6": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "claude-opus-4-5-20251101": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "claude-sonnet-4-5-20250929": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },

  // Google Gemini — https://ai.google.dev/gemini-api/docs/models
  "gemini-3.7-flash": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-3.6-flash": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-3.5-flash": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-3.5-flash-lite": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-3.1-flash-lite": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-3.1-pro-preview": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-3-flash-preview": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-3.1-flash-image": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: true,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64", "gcs"] },
  },
  "gemini-3.1-flash-lite-image": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: true,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64", "gcs"] },
  },
  "gemini-3-pro-image": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: true,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64", "gcs"] },
  },
  "gemini-2.5-pro": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-2.5-flash": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-2.5-flash-lite": {
    visionInput: true,
    audioInput: true,
    videoInput: true,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
      videoFormats: ["url", "base64", "gcs"],
    },
  },
  "gemini-2.5-flash-image": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: true,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64", "gcs"] },
  },
  "gemini-2.5-flash-native-audio-preview-12-2025": {
    visionInput: true,
    audioInput: true,
    videoInput: false,
    imageOutput: false,
    audioOutput: true,
    videoOutput: false,
    mediaFormats: {
      imageFormats: ["url", "base64", "gcs"],
      audioFormats: ["url", "base64", "gcs"],
    },
  },
  "veo-3.1-generate-preview": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: true,
    mediaFormats: { imageFormats: ["url", "base64", "gcs"] },
  },
  "veo-3.1-lite-generate-preview": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: true,
    mediaFormats: { imageFormats: ["url", "base64", "gcs"] },
  },

  // Mistral — https://docs.mistral.ai/getting-started/models/models_overview/
  "mistral-large-latest": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "mistral-large-2512": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "mistral-medium-latest": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "mistral-small-latest": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "mistral-small-2603": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "ministral-14b-2512": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "ministral-8b-2512": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "ministral-3b-2512": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "codestral-latest": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "codestral-2508": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },

  // Cohere — https://docs.cohere.com/docs/models
  "command-a-plus-05-2026": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "command-a-03-2025": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "command-a-reasoning-08-2025": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "command-a-vision-07-2025": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "command-a-translate-08-2025": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "command-r7b-12-2024": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "command-r-plus-08-2024": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "command-r-08-2024": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },

  // Groq — https://console.groq.com/docs/models
  "openai/gpt-oss-120b": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "openai/gpt-oss-20b": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "qwen/qwen3.6-27b": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "minimaxai/minimax-m2.7": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "groq/compound": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "groq/compound-mini": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "whisper-large-v3": {
    visionInput: false,
    audioInput: true,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { audioFormats: ["file"] },
  },
  "whisper-large-v3-turbo": {
    visionInput: false,
    audioInput: true,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { audioFormats: ["file"] },
  },

  // xAI — https://docs.x.ai/docs/models
  "grok-4.6": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "grok-4.5": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "grok-4.3": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "grok-4.20-0309-reasoning": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "grok-4.20-0309-non-reasoning": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "grok-4.20-multi-agent-0309": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },
  "grok-build-0.1": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
    mediaFormats: { imageFormats: ["url", "base64"] },
  },

  // DeepSeek — https://api-docs.deepseek.com/quick_start/pricing (standard, cache miss)
  "deepseek-flash": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "deepseek-v4-pro": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "deepseek-v4-flash": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },

  // Perplexity — https://docs.perplexity.ai (per-request search fees are billed separately)
  sonar: {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
  },
  "sonar-pro": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
  },
  "sonar-pro-search": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
  },
  "sonar-reasoning-pro": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
  },
  "sonar-deep-research": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    webSearch: true,
  },

  // LM Studio / custom OpenAI-compatible servers — self-hosted, no per-token cost
  "qwen3-8b": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "qwen3-14b": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "qwen3-30b-a3b": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "qwen2.5-coder-14b-instruct": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "mistral-7b-instruct-v0.3": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "deepseek-r1-distill-qwen-7b": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "gemma-3-4b-it": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "gemma-3-12b-it": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "gemma-3-27b-it": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "qwen2.5-vl-3b-instruct": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "qwen2.5-vl-7b-instruct": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "qwen2.5-vl-32b-instruct": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "qwen2.5-vl-72b-instruct": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "glm-4v-9b": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "pixtral-12b-2409": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "olmocr-2-7b-1025": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },
  "janus-pro-7b": {
    visionInput: true,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
    mediaFormats: { imageFormats: ["base64"] },
  },

  // Jev (TypeSafe AI) -- text-only, no media in or out, ever.
  // https://docs.typesafe.ai/concepts/state.md
  "jev-latest": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "jev-preview": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
  "jev-1.13.0": {
    visionInput: false,
    audioInput: false,
    videoInput: false,
    imageOutput: false,
    audioOutput: false,
    videoOutput: false,
  },
};

// =============================================================================
// Model Pricing (cents per 1M tokens)
// =============================================================================

/** DeepSeek bills 2x during these weekday UTC hours. */
const DEEPSEEK_PEAK: ModelPricing["peak"] = {
  multiplier: 2,
  windowsUtc: [
    { days: [1, 2, 3, 4, 5], startHour: 1, endHour: 4 },
    { days: [1, 2, 3, 4, 5], startHour: 6, endHour: 10 },
  ],
};

export const MODEL_PRICING: Record<string, ModelPricing> = {
  // OpenAI — https://developers.openai.com/api/docs/pricing
  // Cached input is 0.1x. GPT-5.6 also bills cache writes at 1.25x input.
  // web_search_preview: $10 / 1K calls on reasoning models (GPT-5 family),
  // $25 / 1K on GPT-4.1 and GPT-4o.
  // Sol is on promotion "at least through November 21, 2026"; list is 500 / 3000.
  "gpt-5.6-sol": {
    input: 400,
    output: 2000,
    cachedInput: 40,
    cacheWriteInput: 500,
    searchCall: 1,
    longContext: {
      minPromptTokens: 272_001,
      input: 800,
      output: 3000,
      cachedInput: 80,
    },
  },
  "gpt-5.6-terra": {
    input: 200,
    output: 1200,
    cachedInput: 20,
    cacheWriteInput: 250,
    searchCall: 1,
    longContext: {
      minPromptTokens: 272_001,
      input: 400,
      output: 1800,
      cachedInput: 40,
    },
  },
  "gpt-5.6-luna": {
    input: 20,
    output: 120,
    cachedInput: 2,
    cacheWriteInput: 25,
    searchCall: 1,
    longContext: {
      minPromptTokens: 272_001,
      input: 40,
      output: 180,
      cachedInput: 4,
    },
  },
  // 5.5 / 5.4 long context: "2x input and 1.5x output for the full session"
  "gpt-5.5": {
    input: 500,
    output: 3000,
    cachedInput: 50,
    searchCall: 1,
    longContext: { minPromptTokens: 272_001, input: 1000, output: 4500 },
  },
  "gpt-5.4": {
    input: 250,
    output: 1500,
    cachedInput: 25,
    searchCall: 1,
    longContext: { minPromptTokens: 272_001, input: 500, output: 2250 },
  },
  "gpt-5.4-mini": { input: 75, output: 450, cachedInput: 7.5, searchCall: 1 },
  "gpt-5.4-nano": { input: 20, output: 125, cachedInput: 2, searchCall: 1 },
  "gpt-5": { input: 125, output: 1000, cachedInput: 12.5, searchCall: 1 },
  "gpt-5-mini": { input: 25, output: 200, cachedInput: 2.5, searchCall: 1 },
  "gpt-5-nano": { input: 5, output: 40, cachedInput: 0.5, searchCall: 1 },
  "gpt-4.1": { input: 200, output: 800, cachedInput: 50, searchCall: 2.5 },
  "gpt-4.1-mini": { input: 40, output: 160, cachedInput: 10, searchCall: 2.5 },
  "gpt-4.1-nano": { input: 10, output: 40, cachedInput: 2.5, searchCall: 2.5 }, // Shuts down 2026-10-23
  "gpt-4o": { input: 250, output: 1000, cachedInput: 125, searchCall: 2.5 },
  "gpt-4o-mini": { input: 15, output: 60, cachedInput: 7.5, searchCall: 2.5 },
  // gpt-image-1: text input $5/1M, image-output tokens $40/1M. image-provider
  // reports token usage, so input/output drive the estimate; imageOutput is the
  // per-image fallback (~$0.04 medium 1024^2; 0.011 low – 0.167 high, quality-
  // dependent). Verify on OpenAI's pricing page; model may deprecate 2026-10-23.
  "gpt-image-1": { input: 500, output: 4000, imageInput: 1, imageOutput: 4.2 },
  // gpt-image-2: text in $5/1M, image in $10/1M, image-output tokens $40/1M.
  "gpt-image-2": { input: 500, output: 4000, imageInput: 1, imageOutput: 4.2 },
  // gpt-image-2.5 (-flare and -sunburst, same rates): text in $5/1M, image in
  // $8/1M, image-output tokens $30/1M — cheaper than v1/v2. Token usage drives
  // the estimate; imageOutput (~$0.03 medium 1024^2) is the per-image fallback.
  "gpt-image-2.5-flare": {
    input: 500,
    output: 3000,
    imageInput: 0.8,
    imageOutput: 3,
  },
  "gpt-image-2.5-sunburst": {
    input: 500,
    output: 3000,
    imageInput: 0.8,
    imageOutput: 3,
  },

  // Anthropic — https://platform.claude.com/docs/en/about-claude/pricing
  // 4.6 and later: full 1M context at standard rates, no long-context surcharge.
  // The adapter caches the system prompt (5-minute ephemeral). A read bills at
  // 0.1x input and a write at 1.25x, so each row below is derived from `input`.
  "claude-fable-5": {
    input: 1000,
    output: 5000,
    cachedInput: 100,
    cacheWriteInput: 1250,
  },
  "claude-opus-5": {
    input: 500,
    output: 2500,
    cachedInput: 50,
    cacheWriteInput: 625,
  },
  "claude-sonnet-5": {
    input: 200,
    output: 1000,
    cachedInput: 20,
    cacheWriteInput: 250,
  },
  "claude-haiku-4-5": {
    input: 100,
    output: 500,
    cachedInput: 10,
    cacheWriteInput: 125,
  },
  "claude-opus-4-8": {
    input: 500,
    output: 2500,
    cachedInput: 50,
    cacheWriteInput: 625,
  },
  "claude-opus-4-7": {
    input: 500,
    output: 2500,
    cachedInput: 50,
    cacheWriteInput: 625,
  },
  "claude-opus-4-6": {
    input: 500,
    output: 2500,
    cachedInput: 50,
    cacheWriteInput: 625,
  },
  "claude-sonnet-4-6": {
    input: 300,
    output: 1500,
    cachedInput: 30,
    cacheWriteInput: 375,
  },
  "claude-opus-4-5-20251101": {
    input: 500,
    output: 2500,
    cachedInput: 50,
    cacheWriteInput: 625,
  },
  "claude-sonnet-4-5-20250929": {
    input: 300,
    output: 1500,
    cachedInput: 30,
    cacheWriteInput: 375,
  }, // Retires 2026-09-29

  // Google Gemini — https://ai.google.dev/gemini-api/docs/pricing
  // Images, video and (unless audioTokenInput says otherwise) audio are billed
  // as input tokens at `input`; output includes thinking tokens.
  "gemini-3.7-flash": {
    input: 75,
    output: 375,
    cachedInput: 7.5,
    priceChanges: [
      { from: "2027-01-01", input: 150, output: 750, cachedInput: 15 },
    ],
  },
  "gemini-3.6-flash": {
    input: 75,
    output: 375,
    cachedInput: 7.5,
    priceChanges: [
      { from: "2027-01-01", input: 150, output: 750, cachedInput: 15 },
    ],
  },
  "gemini-3.5-flash": { input: 150, output: 900, cachedInput: 15 },
  "gemini-3.5-flash-lite": { input: 30, output: 250, cachedInput: 3 },
  "gemini-3.1-flash-lite": {
    input: 25,
    output: 150,
    cachedInput: 2.5,
    audioTokenInput: 50,
  }, // Shuts down 2027-05-07
  "gemini-3.1-pro-preview": {
    input: 200,
    output: 1200,
    cachedInput: 20,
    longContext: {
      minPromptTokens: 200_001,
      input: 400,
      output: 1800,
      cachedInput: 40,
    },
  },
  "gemini-3-flash-preview": {
    input: 50,
    output: 300,
    cachedInput: 5,
    audioTokenInput: 100,
  },
  "gemini-3.1-flash-image": { input: 50, output: 300, imageOutput: 6.7 }, // Nano Banana 2; per image at 1K (4.5 at 0.5K, 10.1 at 2K, 15.1 at 4K)
  "gemini-3.1-flash-lite-image": { input: 25, output: 150, imageOutput: 3.36 }, // Nano Banana 2 Lite; per image at 1K
  "gemini-3-pro-image": { input: 200, output: 1200, imageOutput: 13.4 }, // Nano Banana Pro; per image at 1K/2K (24 at 4K)
  "gemini-2.5-pro": {
    input: 125,
    output: 1000,
    cachedInput: 12.5,
    longContext: {
      minPromptTokens: 200_001,
      input: 250,
      output: 1500,
      cachedInput: 25,
    },
  },
  "gemini-2.5-flash": {
    input: 30,
    output: 250,
    cachedInput: 3,
    audioTokenInput: 100,
  },
  "gemini-2.5-flash-lite": {
    input: 10,
    output: 40,
    cachedInput: 1,
    audioTokenInput: 30,
  },
  "gemini-2.5-flash-image": { input: 30, output: 250, imageOutput: 3.9 }, // Shuts down 2026-10-02
  "gemini-2.5-flash-native-audio-preview-12-2025": {
    input: 50,
    output: 200,
    audioTokenInput: 300,
  }, // Audio output is $12 / 1M tokens
  // Veo is billed per second of video; stored per minute as ModelPricing expects.
  "veo-3.1-generate-preview": { input: 0, output: 0, videoOutput: 2400 }, // $0.40/s at 720p/1080p, $0.60/s at 4K
  "veo-3.1-lite-generate-preview": { input: 0, output: 0, videoOutput: 300 }, // $0.05/s at 720p, $0.08/s at 1080p

  // Mistral — https://mistral.ai/pricing/api
  // Cached input is "up to 90%" cheaper; the exact rate is unpublished, so
  // cached tokens are priced at the full input rate.
  "mistral-large-latest": { input: 50, output: 150 },
  "mistral-large-2512": { input: 50, output: 150 },
  "mistral-medium-latest": { input: 150, output: 750 },
  "mistral-small-latest": { input: 15, output: 60 },
  "mistral-small-2603": { input: 15, output: 60 },
  "ministral-14b-2512": { input: 20, output: 20 },
  "ministral-8b-2512": { input: 15, output: 15 },
  "ministral-3b-2512": { input: 10, output: 10 },
  "codestral-latest": { input: 30, output: 90 },
  "codestral-2508": { input: 30, output: 90 },

  // Cohere — https://docs.cohere.com/docs/models
  "command-a-03-2025": { input: 250, output: 1000 },
  // No published token price for A+, Reasoning, Vision, or Translate: free up
  // to rate limits, production use via Model Vault or sales. Command A's rate
  // is assumed.
  "command-a-plus-05-2026": { input: 250, output: 1000 },
  "command-a-reasoning-08-2025": { input: 250, output: 1000 },
  "command-a-vision-07-2025": { input: 250, output: 1000 },
  "command-a-translate-08-2025": { input: 250, output: 1000 },
  "command-r7b-12-2024": { input: 3.75, output: 15 },
  "command-r-plus-08-2024": { input: 250, output: 1000 },
  "command-r-08-2024": { input: 15, output: 60 },

  // Groq — https://console.groq.com/docs/models
  "openai/gpt-oss-120b": { input: 15, output: 60, cachedInput: 7.5 },
  "openai/gpt-oss-20b": { input: 7.5, output: 30, cachedInput: 3.75 },
  "qwen/qwen3.6-27b": { input: 60, output: 300 },
  // Enterprise only, "Contact Sales"; no public price. Last public rate kept.
  "minimaxai/minimax-m2.7": { input: 29, output: 115 },
  // Compound is priced from its per-model and per-tool breakdown
  // (`compoundCostCents`); these rates apply only when a response lacks one.
  "groq/compound": { input: 15, output: 60 },
  "groq/compound-mini": { input: 15, output: 60 },
  // Whisper, per minute of audio ($0.111 and $0.04 per hour), 10 s minimum
  "whisper-large-v3": { input: 0, output: 0, audioInput: 0.185 },
  "whisper-large-v3-turbo": { input: 0, output: 0, audioInput: 0.04 / 0.6 },

  // xAI — https://docs.x.ai/docs/models
  // Responses carry the billed amount (`cost_in_usd_ticks`), which is used when
  // present. Prompts of 200K tokens or more bill every token at 2x.
  "grok-4.6": {
    input: 200,
    output: 600,
    cachedInput: 50,
    longContext: {
      minPromptTokens: 200_000,
      input: 400,
      output: 1200,
      cachedInput: 100,
    },
  },
  "grok-4.5": {
    input: 200,
    output: 600,
    cachedInput: 30,
    longContext: {
      minPromptTokens: 200_000,
      input: 400,
      output: 1200,
      cachedInput: 60,
    },
  },
  "grok-4.3": {
    input: 125,
    output: 250,
    cachedInput: 20,
    longContext: {
      minPromptTokens: 200_000,
      input: 250,
      output: 500,
      cachedInput: 40,
    },
  },
  "grok-4.20-0309-reasoning": {
    input: 125,
    output: 250,
    cachedInput: 20,
    longContext: {
      minPromptTokens: 200_000,
      input: 250,
      output: 500,
      cachedInput: 40,
    },
  },
  "grok-4.20-0309-non-reasoning": {
    input: 125,
    output: 250,
    cachedInput: 20,
    longContext: {
      minPromptTokens: 200_000,
      input: 250,
      output: 500,
      cachedInput: 40,
    },
  },
  "grok-4.20-multi-agent-0309": {
    input: 125,
    output: 250,
    cachedInput: 20,
    longContext: {
      minPromptTokens: 200_000,
      input: 250,
      output: 500,
      cachedInput: 40,
    },
  },
  "grok-build-0.1": {
    input: 100,
    output: 200,
    cachedInput: 20,
    longContext: {
      minPromptTokens: 200_000,
      input: 200,
      output: 400,
      cachedInput: 40,
    },
  },

  // DeepSeek — https://api-docs.deepseek.com/quick_start/pricing
  // Off-peak rates; peak hours (01:00-04:00 and 06:00-10:00 UTC, Mon-Fri) bill
  // at 2x. V4.1 Flash repriced 2026-09-10; `deepseek-v4-flash` now runs on it.
  "deepseek-flash": {
    input: 15,
    output: 60,
    cachedInput: 0.3,
    peak: DEEPSEEK_PEAK,
  },
  "deepseek-v4-pro": {
    input: 66,
    output: 198,
    cachedInput: 2.2,
    peak: DEEPSEEK_PEAK,
  },
  "deepseek-v4-flash": {
    input: 15,
    output: 60,
    cachedInput: 0.3,
    peak: DEEPSEEK_PEAK,
  },

  // Perplexity — https://docs.perplexity.ai/docs/getting-started/pricing
  // Responses carry the billed amount (`usage.cost.total_cost`), which is used
  // when present. The request fee below is the default (low) search context.
  // Sonar is supported until 2026-09-27, then replaced by the Agent API.
  sonar: { input: 100, output: 100, requestFee: 0.5 },
  "sonar-pro": { input: 300, output: 1500, requestFee: 0.6 },
  // Not a real model ID: Pro Search is sonar-pro with search_type "pro"
  "sonar-pro-search": { input: 300, output: 1500, requestFee: 1.4 },
  "sonar-reasoning-pro": { input: 200, output: 800, requestFee: 0.6 },
  "sonar-deep-research": {
    input: 200,
    output: 800,
    citationTokens: 200,
    reasoningTokens: 300,
    searchCall: 0.5,
  },

  // LM Studio / custom OpenAI-compatible servers — self-hosted, no per-token cost
  "qwen3-8b": { input: 0, output: 0 },
  "qwen3-14b": { input: 0, output: 0 },
  "qwen3-30b-a3b": { input: 0, output: 0 },
  "qwen2.5-coder-14b-instruct": { input: 0, output: 0 },
  "mistral-7b-instruct-v0.3": { input: 0, output: 0 },
  "deepseek-r1-distill-qwen-7b": { input: 0, output: 0 },
  "gemma-3-4b-it": { input: 0, output: 0 },
  "gemma-3-12b-it": { input: 0, output: 0 },
  "gemma-3-27b-it": { input: 0, output: 0 },
  "qwen2.5-vl-3b-instruct": { input: 0, output: 0 },
  "qwen2.5-vl-7b-instruct": { input: 0, output: 0 },
  "qwen2.5-vl-32b-instruct": { input: 0, output: 0 },
  "qwen2.5-vl-72b-instruct": { input: 0, output: 0 },
  "glm-4v-9b": { input: 0, output: 0 },
  "pixtral-12b-2409": { input: 0, output: 0 },
  "olmocr-2-7b-1025": { input: 0, output: 0 },
  "janus-pro-7b": { input: 0, output: 0 },

  // Jev (TypeSafe AI) -- https://docs.typesafe.ai (confirmed 2026-09-23).
  // $0.042 / 1M input tokens = 4.2 cents / 1M; output tokens are free since
  // Jev never generates text, only a typed answer per declared question.
  "jev-latest": { input: 4.2, output: 0 },
  "jev-preview": { input: 4.2, output: 0 },
  "jev-1.13.0": { input: 4.2, output: 0 },
};

// Default pricing for unknown models
export const DEFAULT_MODEL_PRICING: ModelPricing = { input: 100, output: 300 };

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get provider configuration by ID.
 * @param providerId - The provider identifier (e.g., "openai", "anthropic")
 * @returns The provider config or undefined if not found
 */
export function getProviderById(
  providerId: LlmProvider
): ProviderConfig | undefined {
  return PROVIDERS.find(p => p.id === providerId);
}

/**
 * Get the list of model IDs for a given provider.
 * @param providerId - The provider identifier
 * @returns Array of model ID strings
 */
export function getModelsForProvider(providerId: LlmProvider): string[] {
  return PROVIDER_MODELS[providerId] ?? [];
}

/**
 * Get capabilities for a specific model (vision, audio, video I/O).
 * Returns empty object for unknown models (permissive by default).
 * @param model - The model identifier
 * @returns Model capabilities
 */
export function getModelCapabilities(model: string): ModelCapabilities {
  return MODEL_CAPABILITIES[model] ?? {};
}

/** Self-hosted models cost nothing per token, whatever they are called. */
const FREE_PRICING: ModelPricing = { input: 0, output: 0 };

/**
 * Snapshot suffixes providers append to a model they report back:
 * `gpt-4.1-mini-2025-04-14` (OpenAI) and `claude-haiku-4-5-20251001`
 * (Anthropic, for an alias).
 */
const SNAPSHOT_SUFFIX = /-(\d{4}-\d{2}-\d{2}|\d{8})$/;

export interface ModelPricingLookup {
  /** The provider serving the model. `lm_studio` is always free. */
  provider?: LlmProvider;
  /** The model the endpoint asked for, tried when the reported one is unknown. */
  configuredModel?: string | null;
}

function catalogPricing(model: string | null | undefined) {
  if (!model) return undefined;
  return (
    MODEL_PRICING[model] ?? MODEL_PRICING[model.replace(SNAPSHOT_SUFFIX, "")]
  );
}

/**
 * Pricing for a model, or undefined when the catalog does not know it.
 *
 * Tries the model as reported, then without a snapshot suffix, then the same
 * for `configuredModel`.
 */
export function findModelPricing(
  model: string,
  options: ModelPricingLookup = {}
): ModelPricing | undefined {
  if (options.provider === "lm_studio") return FREE_PRICING;
  const found =
    catalogPricing(model) ?? catalogPricing(options.configuredModel);
  if (found || options.provider !== "openrouter") return found;
  // OpenRouter names a model `vendor/model`; the vendor's own id follows the
  // slash. Only for OpenRouter: Groq's catalog ids contain a slash too.
  const vendorId = (id: string | null | undefined) =>
    id?.includes("/") ? id.slice(id.indexOf("/") + 1) : undefined;
  return (
    catalogPricing(vendorId(model)) ??
    catalogPricing(vendorId(options.configuredModel))
  );
}

/**
 * Get pricing for a specific model (cents per 1M tokens).
 * Returns DEFAULT_MODEL_PRICING for unknown models, and zero for any model on a
 * self-hosted (`lm_studio`) server.
 * @param model - The model identifier, as reported by the provider
 * @param options - Provider and configured model, for a more reliable match
 * @returns Model pricing
 */
export function getModelPricing(
  model: string,
  options: ModelPricingLookup = {}
): ModelPricing {
  return findModelPricing(model, options) ?? DEFAULT_MODEL_PRICING;
}

/**
 * Get the provider for a given model name.
 * Searches through PROVIDER_MODELS to find which provider owns this model.
 */
export function getProviderForModel(model: string): LlmProvider {
  for (const [provider, models] of Object.entries(PROVIDER_MODELS)) {
    if (models.includes(model)) {
      return provider as LlmProvider;
    }
  }
  // Default to openai for unknown models (OpenAI-compatible format)
  return "openai";
}
