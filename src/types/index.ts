/**
 * @sudobility/shapeshyft_engine/types
 * Product-neutral domain types shared by ShapeShyft and ShapeRouter.
 *
 * No runtime imports: frontend packages re-export this module.
 */

// Re-export common types from @sudobility/types
export type {
  ApiResponse,
  BaseResponse,
  NetworkClient,
  Optional,
  PaginatedResponse,
  PaginationInfo,
  PaginationOptions,
} from "@sudobility/types";

import type { Optional, BaseResponse } from "@sudobility/types";

// =============================================================================
// Enum Types
// =============================================================================

export type LlmProvider =
  | "openai"
  | "anthropic"
  | "gemini"
  | "mistral"
  | "cohere"
  | "groq"
  | "xai"
  | "deepseek"
  | "perplexity"
  | "lm_studio"
  | "jev"
  | "openrouter"
  // Image-generation providers (output images, not text/structured JSON). Their
  // real API calls live in each product's image-provider wrapper (e.g.
  // shapeshyft_api/src/image-provider.ts); the engine registers them in the
  // catalog and returns an image-only stub from createLLMProvider.
  | "bytedance"
  | "bfl"
  | "ideogram"
  | "recraft"
  | "stability"
  // More image providers; `fal` is a multi-model image aggregator (any fal
  // model id), `alibaba` serves Qwen-Image.
  | "fal"
  | "leonardo"
  | "luma"
  | "alibaba"
  | "runway"
  // Video-generation providers. `pika` is a multi-vendor video gateway.
  | "kling"
  | "minimax"
  | "pika"
  // Audio-generation provider (text-to-speech)
  | "elevenlabs";

export type HttpMethod = "GET" | "POST";

/**
 * Media type for multimodal content
 */
export type MediaType = "image" | "audio" | "video";

// =============================================================================
// LLM Provider Models
// =============================================================================

/** OpenAI model options (verified 2026-08-18) */
export type OpenAiModel =
  | "gpt-5.6-sol"
  | "gpt-5.6-terra"
  | "gpt-5.6-luna"
  | "gpt-5.5"
  | "gpt-5.4"
  | "gpt-5.4-mini"
  | "gpt-5.4-nano"
  | "gpt-5"
  | "gpt-5-mini"
  | "gpt-5-nano"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "gpt-4o"
  | "gpt-4o-mini";

/** Anthropic model options (verified 2026-08-18) */
export type AnthropicModel =
  | "claude-fable-5"
  | "claude-opus-5"
  | "claude-sonnet-5"
  | "claude-haiku-4-5"
  | "claude-opus-4-8"
  | "claude-opus-4-7"
  | "claude-opus-4-6"
  | "claude-sonnet-4-6"
  | "claude-opus-4-5-20251101"
  | "claude-sonnet-4-5-20250929";

/** Google Gemini model options (verified 2026-08-18) */
export type GeminiModel =
  | "gemini-3.7-flash"
  | "gemini-3.6-flash"
  | "gemini-3.5-flash"
  | "gemini-3.5-flash-lite"
  | "gemini-3.1-flash-lite"
  | "gemini-3.1-pro-preview"
  | "gemini-3-flash-preview"
  | "gemini-3.1-flash-image"
  | "gemini-3.1-flash-lite-image"
  | "gemini-3-pro-image"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash-image"
  | "gemini-2.5-flash-native-audio-preview-12-2025"
  | "veo-3.1-generate-preview"
  | "veo-3.1-lite-generate-preview";

/** Mistral AI model options (verified 2026-08-18) */
export type MistralModel =
  | "mistral-large-latest"
  | "mistral-large-2512"
  | "mistral-medium-latest"
  | "mistral-small-latest"
  | "mistral-small-2603"
  | "ministral-14b-2512"
  | "ministral-8b-2512"
  | "ministral-3b-2512"
  | "codestral-latest"
  | "codestral-2508";

/** Cohere model options (verified 2026-08-18) */
export type CohereModel =
  | "command-a-plus-05-2026"
  | "command-a-03-2025"
  | "command-a-reasoning-08-2025"
  | "command-a-vision-07-2025"
  | "command-a-translate-08-2025"
  | "command-r7b-12-2024"
  | "command-r-plus-08-2024"
  | "command-r-08-2024";

/** Groq model options (verified 2026-08-18) */
export type GroqModel =
  | "openai/gpt-oss-120b"
  | "openai/gpt-oss-20b"
  | "qwen/qwen3.6-27b"
  | "minimaxai/minimax-m2.7"
  | "groq/compound"
  | "groq/compound-mini"
  | "whisper-large-v3"
  | "whisper-large-v3-turbo";

/** xAI (Grok) model options (verified 2026-08-18) */
export type XaiModel =
  | "grok-4.6"
  | "grok-4.5"
  | "grok-4.3"
  | "grok-4.20-0309-reasoning"
  | "grok-4.20-0309-non-reasoning"
  | "grok-4.20-multi-agent-0309"
  | "grok-build-0.1"
  // Image generation (OpenAI-compatible /v1/images/generations). Verified
  // 2026-11-23 against docs.x.ai.
  | "grok-imagine-image-2.0"
  | "grok-imagine-image";

/** DeepSeek model options (verified 2026-09-14) */
export type DeepSeekModel =
  "deepseek-flash" | "deepseek-v4-pro" | "deepseek-v4-flash";

/** Perplexity model options (verified 2026-08-18) */
export type PerplexityModel =
  | "sonar"
  | "sonar-pro"
  | "sonar-pro-search"
  | "sonar-reasoning-pro"
  | "sonar-deep-research";

/**
 * Jev (TypeSafe AI) model options (verified 2026-09-20).
 *
 * Jev is not a text-generation model: it is a "System One" model that answers
 * pre-declared Choice/Score/Noul questions with calibrated probabilities
 * instead of writing free-form text. `jev-latest` and `jev-preview` are
 * aliases that currently point to `jev-1.13.0` and move when a new release
 * ships; pin `jev-1.13.0` for answers that must not shift under you.
 * @see https://docs.typesafe.ai/models
 */
export type JevModel = "jev-latest" | "jev-preview" | "jev-1.13.0";

/** Custom LLM server models (suggested options; any string is valid) */
export type LlmServerModel =
  | "qwen3-8b"
  | "qwen3-14b"
  | "qwen3-30b-a3b"
  | "qwen2.5-coder-14b-instruct"
  | "mistral-7b-instruct-v0.3"
  | "deepseek-r1-distill-qwen-7b"
  | "gemma-3-4b-it"
  | "gemma-3-12b-it"
  | "gemma-3-27b-it"
  | "qwen2.5-vl-3b-instruct"
  | "qwen2.5-vl-7b-instruct"
  | "qwen2.5-vl-32b-instruct"
  | "qwen2.5-vl-72b-instruct"
  | "glm-4v-9b"
  | "pixtral-12b-2409"
  | "olmocr-2-7b-1025"
  | "janus-pro-7b"
  | string;

/**
 * ByteDance Seedream image models (verified 2026-11-23 against BytePlus ModelArk
 * docs.byteplus.com/docs/en/modelark/model-list). Bare IDs are the BytePlus
 * (international) namespace; Volcano Engine Ark (China) prefixes the same
 * snapshots with `doubao-`. The engine registers the BytePlus IDs.
 * @see https://docs.byteplus.com/docs/en/modelark/image-generation-api
 */
export type BytedanceModel =
  | "dola-seedream-5-5-261028"
  | "dola-seedream-5-0-pro-260628"
  | "dola-seedream-5-0-flash-260915"
  | "seedream-5-0-lite-260128"
  | "seedream-4-5-251128"
  | "seedream-4-0-250828"
  | "seededit-3-0-i2i-250628";

/**
 * Black Forest Labs FLUX image models (verified 2026-11-23 against docs.bfl.ai).
 * These are the submit-endpoint slugs (`POST /v1/<slug>`); generation is async
 * (submit returns a polling_url).
 * @see https://docs.bfl.ai/api-reference
 */
export type BflModel =
  | "flux-pro-1.1"
  | "flux-pro-1.1-ultra"
  | "flux-dev"
  | "flux-kontext-pro"
  | "flux-kontext-max"
  | "flux-2-pro"
  | "flux-3-image";

/**
 * Ideogram image models (verified 2026-11-23 against developer.ideogram.ai v2).
 * The model is selected by the URL path (`/v2/image/generate/ideogram-3`); the
 * `-turbo`/`-quality` suffixes here are synthetic ids the adapter maps onto the
 * API's `rendering_speed` (TURBO/DEFAULT/QUALITY) so callers can pick the tier.
 * @see https://developer.ideogram.ai/v2/api-reference/images/generate/ideogram-3
 */
export type IdeogramModel =
  "ideogram-3" | "ideogram-3-turbo" | "ideogram-3-quality";

/**
 * Recraft image models (verified 2026-11-23 against recraft.ai/docs). `model`
 * body field; `_vector` variants emit SVG/vector output.
 * @see https://www.recraft.ai/docs/api-reference/models/recraft-v3
 */
export type RecraftModel = "recraftv3" | "recraftv3_vector" | "recraftv2";

/**
 * Stability AI image models (verified 2026-11-23 against docs.stability.ai).
 * `stable-image-ultra`/`-core` are their own endpoints; the `sd3.5-*` ids hit
 * the `/sd3` endpoint with a `model` field.
 * @see https://docs.stability.ai/api-reference
 */
export type StabilityModel =
  | "stable-image-ultra"
  | "stable-image-core"
  | "sd3.5-large"
  | "sd3.5-large-turbo"
  | "sd3.5-medium";

/**
 * fal.ai aggregator model ids (verified 2026-11-23 against fal.ai/docs). Any
 * `owner/app[/path]` id fal lists is valid (allowsCustomModel); these are the
 * popular suggestions. The adapter calls the synchronous `fal.run/{id}` path.
 */
export type FalModel =
  | "fal-ai/flux/dev"
  | "fal-ai/flux/schnell"
  | "fal-ai/flux-pro/v1.1"
  | "fal-ai/fast-sdxl"
  | "fal-ai/recraft/v3/text-to-image"
  | "fal-ai/ideogram/v3"
  | "fal-ai/qwen-image"
  | "fal-ai/bytedance/seedream/v4/text-to-image"
  | "fal-ai/luma-photon"
  | (string & {});

/**
 * Leonardo.ai image models (verified 2026-11-23 against docs.leonardo.ai). The
 * `modelId` is a UUID; these friendly ids are mapped to UUIDs by the adapter.
 */
export type LeonardoModel =
  | "lucid-origin"
  | "lucid-realism"
  | "phoenix-1.0"
  | "flux-dev"
  | "flux-schnell";

/**
 * Luma AI image models (Photon; verified 2026-11-23 against docs.lumalabs.ai).
 * Text-to-image only here -- Luma accepts reference images only as public URLs,
 * not base64.
 */
export type LumaModel = "photon-1" | "photon-flash-1";

/**
 * Alibaba Qwen-Image models (verified 2026-11-23 against help.aliyun.com
 * model-studio). Synchronous multimodal-generation endpoint.
 */
export type AlibabaModel = "qwen-image-3.0-pro" | "qwen-image-2.0";

/**
 * Runway Gen-4 image models (verified 2026-11-23 against docs.dev.runwayml.com).
 * `gen4_image_turbo` requires at least one reference image.
 */
export type RunwayModel = "gen4_image" | "gen4_image_turbo";

/**
 * Kuaishou Kling video models (verified 2026-11-23 against kling.ai/document-api,
 * current path-based design). Model id goes in the URL path.
 */
export type KlingModel =
  "kling-2.6" | "kling-2.5-turbo" | "kling-4.0" | "kling-4.0-flash";

/**
 * MiniMax Hailuo video models (verified 2026-11-23 against platform.minimax.io).
 */
export type MinimaxModel =
  "MiniMax-Hailuo-2.3" | "MiniMax-Hailuo-02" | "T2V-01-Director" | "T2V-01";

/**
 * Pika video gateway (verified 2026-11-23 against dev.pika.art). Pika's own
 * multi-vendor gateway; the model id is a `vendor/model/function` operation slug
 * pulled from its live catalog (allowsCustomModel).
 */
export type PikaModel = string & {};

/**
 * ElevenLabs text-to-speech models (verified 2026-11-23 against elevenlabs.io).
 * The adapter sends a default voice; billing is per character.
 */
export type ElevenLabsModel =
  "eleven_multilingual_v2" | "eleven_v4" | "eleven_v3" | "eleven_flash_v2_5";

/** Union of all model types */
export type LlmModel =
  | OpenAiModel
  | AnthropicModel
  | GeminiModel
  | MistralModel
  | CohereModel
  | GroqModel
  | XaiModel
  | DeepSeekModel
  | PerplexityModel
  | JevModel
  | BytedanceModel
  | BflModel
  | IdeogramModel
  | RecraftModel
  | StabilityModel
  | FalModel
  | LeonardoModel
  | LumaModel
  | AlibabaModel
  | RunwayModel
  | KlingModel
  | MinimaxModel
  | PikaModel
  | ElevenLabsModel
  | LlmServerModel;

/** List of available providers */
export const LLM_PROVIDERS: LlmProvider[] = [
  "openai",
  "anthropic",
  "gemini",
  "mistral",
  "cohere",
  "groq",
  "xai",
  "deepseek",
  "perplexity",
  "lm_studio",
  "jev",
  "openrouter",
  "bytedance",
  "bfl",
  "ideogram",
  "recraft",
  "stability",
  "fal",
  "leonardo",
  "luma",
  "alibaba",
  "runway",
  "kling",
  "minimax",
  "pika",
  "elevenlabs",
];

/**
 * Mapping of each LLM provider to its known valid model IDs.
 * Useful for both server-side validation and client-side form validation.
 *
 * Note: `lm_studio` has an empty list because it accepts arbitrary
 * user-supplied model names (any string is valid).
 */
export const PROVIDER_MODELS: Record<LlmProvider, readonly string[]> = {
  openai: [
    "gpt-5.6-sol",
    "gpt-5.6-terra",
    "gpt-5.6-luna",
    "gpt-5.5",
    "gpt-5.4",
    "gpt-5.4-mini",
    "gpt-5.4-nano",
    "gpt-5",
    "gpt-5-mini",
    "gpt-5-nano",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "gpt-4o",
    "gpt-4o-mini",
  ] as const,
  anthropic: [
    "claude-fable-5",
    "claude-opus-5",
    "claude-sonnet-5",
    "claude-haiku-4-5",
    "claude-opus-4-8",
    "claude-opus-4-7",
    "claude-opus-4-6",
    "claude-sonnet-4-6",
    "claude-opus-4-5-20251101",
    "claude-sonnet-4-5-20250929",
  ] as const,
  gemini: [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-image",
    "gemini-3.1-flash-lite-image",
    "gemini-3-pro-image",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash-image",
    "gemini-2.5-flash-native-audio-preview-12-2025",
    "veo-3.1-generate-preview",
    "veo-3.1-lite-generate-preview",
  ] as const,
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
  ] as const,
  cohere: [
    "command-a-plus-05-2026",
    "command-a-03-2025",
    "command-a-reasoning-08-2025",
    "command-a-vision-07-2025",
    "command-a-translate-08-2025",
    "command-r7b-12-2024",
    "command-r-plus-08-2024",
    "command-r-08-2024",
  ] as const,
  groq: [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.6-27b",
    "minimaxai/minimax-m2.7",
    "groq/compound",
    "groq/compound-mini",
    "whisper-large-v3",
    "whisper-large-v3-turbo",
  ] as const,
  xai: [
    "grok-4.6",
    "grok-4.5",
    "grok-4.3",
    "grok-4.20-0309-reasoning",
    "grok-4.20-0309-non-reasoning",
    "grok-4.20-multi-agent-0309",
    "grok-build-0.1",
    "grok-imagine-image-2.0",
    "grok-imagine-image",
  ] as const,
  deepseek: ["deepseek-flash", "deepseek-v4-pro", "deepseek-v4-flash"] as const,
  perplexity: [
    "sonar",
    "sonar-pro",
    "sonar-pro-search",
    "sonar-reasoning-pro",
    "sonar-deep-research",
  ] as const,
  lm_studio: [] as const, // any model name is valid on a custom server
  jev: ["jev-latest", "jev-preview", "jev-1.13.0"] as const,
  // Suggestions only: OpenRouter routes any `vendor/model` id it lists, so any
  // string is accepted (see isValidModelForProvider).
  openrouter: [
    "openai/gpt-5.6-terra",
    "anthropic/claude-sonnet-5",
    "deepseek/deepseek-v4-pro",
  ] as const,
  // Image-generation providers (see the LlmProvider union note).
  bytedance: [
    "dola-seedream-5-5-261028",
    "dola-seedream-5-0-pro-260628",
    "dola-seedream-5-0-flash-260915",
    "seedream-5-0-lite-260128",
    "seedream-4-5-251128",
    "seedream-4-0-250828",
    "seededit-3-0-i2i-250628",
  ] as const,
  bfl: [
    "flux-pro-1.1",
    "flux-pro-1.1-ultra",
    "flux-dev",
    "flux-kontext-pro",
    "flux-kontext-max",
    "flux-2-pro",
    "flux-3-image",
  ] as const,
  ideogram: ["ideogram-3", "ideogram-3-turbo", "ideogram-3-quality"] as const,
  recraft: ["recraftv3", "recraftv3_vector", "recraftv2"] as const,
  stability: [
    "stable-image-ultra",
    "stable-image-core",
    "sd3.5-large",
    "sd3.5-large-turbo",
    "sd3.5-medium",
  ] as const,
  // fal.ai aggregator -- any `owner/app[/path]` id (allowsCustomModel).
  fal: [
    "fal-ai/flux/dev",
    "fal-ai/flux/schnell",
    "fal-ai/flux-pro/v1.1",
    "fal-ai/fast-sdxl",
    "fal-ai/recraft/v3/text-to-image",
    "fal-ai/ideogram/v3",
    "fal-ai/qwen-image",
    "fal-ai/bytedance/seedream/v4/text-to-image",
    "fal-ai/luma-photon",
  ] as const,
  leonardo: [
    "lucid-origin",
    "lucid-realism",
    "phoenix-1.0",
    "flux-dev",
    "flux-schnell",
  ] as const,
  luma: ["photon-1", "photon-flash-1"] as const,
  alibaba: ["qwen-image-3.0-pro", "qwen-image-2.0"] as const,
  runway: ["gen4_image", "gen4_image_turbo"] as const,
  kling: [
    "kling-2.6",
    "kling-2.5-turbo",
    "kling-4.0",
    "kling-4.0-flash",
  ] as const,
  minimax: [
    "MiniMax-Hailuo-2.3",
    "MiniMax-Hailuo-02",
    "T2V-01-Director",
    "T2V-01",
  ] as const,
  // Pika multi-vendor video gateway -- any operation slug (allowsCustomModel);
  // these are suggestions pulled from its catalog.
  pika: [
    "pika/pika-2.5/text-to-video",
    "pika/pika-2.5/image-to-video",
  ] as const,
  elevenlabs: [
    "eleven_multilingual_v2",
    "eleven_v4",
    "eleven_v3",
    "eleven_flash_v2_5",
  ] as const,
} as const;

/**
 * Check whether a model ID is valid for the given provider.
 * For `lm_studio` and `openrouter`, any string is valid (returns true): users
 * run arbitrary models on their own server, and OpenRouter routes free-form
 * `vendor/model` ids.
 *
 * @param provider - The LLM provider to validate against
 * @param model - The model ID string to check
 * @returns true if the model is a known valid model for the provider
 */
export function isValidModelForProvider(
  provider: LlmProvider,
  model: string
): boolean {
  const models = PROVIDER_MODELS[provider];
  // lm_studio and openrouter accept any model string, as do the aggregators
  // (fal routes any fal model id; pika routes any gateway operation slug).
  if (
    provider === "lm_studio" ||
    provider === "openrouter" ||
    provider === "fal" ||
    provider === "pika"
  )
    return true;
  return models.includes(model);
}

// =============================================================================
// Model Capabilities (Multimodal Support)
// =============================================================================

/**
 * Supported media input formats for different providers/models.
 * - url: HTTP/HTTPS URLs to media files
 * - base64: Base64-encoded binary data (data URLs)
 * - gcs: Google Cloud Storage URIs (gs://bucket/path)
 * - s3: AWS S3 URIs (s3://bucket/key)
 * - file: Direct file upload (multipart form data)
 */
export type MediaInputFormat = "url" | "base64" | "gcs" | "s3" | "file";

/**
 * Media format support configuration for a model.
 * Specifies which input formats are supported for each media type.
 */
export interface MediaFormatSupport {
  /** Supported formats for image input */
  imageFormats?: MediaInputFormat[];
  /** Supported formats for audio input */
  audioFormats?: MediaInputFormat[];
  /** Supported formats for video input */
  videoFormats?: MediaInputFormat[];
}

/**
 * Capabilities for a model's input and output modalities.
 * undefined = unknown (user's responsibility to verify)
 * true = supported
 * false = not supported
 */
export interface ModelCapabilities {
  // Input capabilities (what the model can receive)
  visionInput?: boolean; // Can process images
  audioInput?: boolean; // Can process audio
  videoInput?: boolean; // Can process video

  // Output capabilities (what the model can generate)
  imageOutput?: boolean; // Can generate images
  audioOutput?: boolean; // Can generate audio
  videoOutput?: boolean; // Can generate video

  // Tool capabilities
  webSearch?: boolean; // Can use web search (e.g., OpenAI Responses API)

  // Media format support (what formats the model accepts)
  mediaFormats?: MediaFormatSupport;
}

// =============================================================================
// Multimodal Content Types
// =============================================================================

/**
 * Media content for LLM input (images, audio, video).
 * Used to pass media to multimodal models.
 */
export interface MediaContent {
  /** Type of media */
  type: MediaType;
  /** Format of the data */
  format: "base64" | "url";
  /** MIME type (e.g., "image/png", "audio/mp3", "video/mp4") */
  mimeType: string;
  /** Base64 data (without prefix) or URL */
  data: string;
  /** Original field name from input (for debugging/logging) */
  fieldName?: string;
}

/**
 * Generated media from LLM output (Imagen, Veo, GPT-4o audio).
 * Returned when models generate images, audio, or video.
 */
export interface GeneratedMedia {
  /** Type of generated media */
  type: MediaType;
  /** MIME type of the generated media */
  mimeType: string;
  /** Base64 data or URL depending on output format configuration */
  data: string;
}

// =============================================================================
// Schema Capability Detection
// =============================================================================

/**
 * Required capabilities detected from a schema
 */
export interface RequiredCapabilities {
  visionInput?: boolean; // Matches ModelCapabilities.visionInput
  audioInput?: boolean;
  videoInput?: boolean;
  imageOutput?: boolean;
  audioOutput?: boolean;
  videoOutput?: boolean;
}

/**
 * Detect media type from contentMediaType string
 */
function detectMediaType(
  contentMediaType: string
): "image" | "audio" | "video" | null {
  if (contentMediaType.startsWith("image/")) return "image";
  if (contentMediaType.startsWith("audio/")) return "audio";
  if (contentMediaType.startsWith("video/")) return "video";
  return null;
}

/**
 * Recursively scan a JSON schema for media type properties.
 * Returns detected media types.
 */
function scanSchemaForMediaTypes(
  schema: Record<string, unknown>,
  result: Set<"image" | "audio" | "video">
): void {
  if (!schema || typeof schema !== "object") return;

  // Check if this property has contentMediaType
  const contentMediaType = schema["contentMediaType"];
  if (typeof contentMediaType === "string") {
    const mediaType = detectMediaType(contentMediaType);
    if (mediaType) {
      result.add(mediaType);
    }
  }

  // Recurse into properties
  const properties = schema["properties"];
  if (properties && typeof properties === "object") {
    for (const prop of Object.values(properties as Record<string, unknown>)) {
      if (prop && typeof prop === "object") {
        scanSchemaForMediaTypes(prop as Record<string, unknown>, result);
      }
    }
  }

  // Recurse into array items
  const items = schema["items"];
  if (items && typeof items === "object") {
    scanSchemaForMediaTypes(items as Record<string, unknown>, result);
  }
}

/**
 * Detect required capabilities from input and output schemas.
 * Returns which media capabilities are required.
 */
export function detectRequiredCapabilities(
  inputSchema?: Record<string, unknown> | null,
  outputSchema?: Record<string, unknown> | null
): RequiredCapabilities {
  const result: RequiredCapabilities = {};

  // Scan input schema for required input capabilities
  if (inputSchema) {
    const inputMediaTypes = new Set<"image" | "audio" | "video">();
    scanSchemaForMediaTypes(inputSchema, inputMediaTypes);
    if (inputMediaTypes.has("image")) result.visionInput = true;
    if (inputMediaTypes.has("audio")) result.audioInput = true;
    if (inputMediaTypes.has("video")) result.videoInput = true;
  }

  // Scan output schema for required output capabilities
  if (outputSchema) {
    const outputMediaTypes = new Set<"image" | "audio" | "video">();
    scanSchemaForMediaTypes(outputSchema, outputMediaTypes);
    if (outputMediaTypes.has("image")) result.imageOutput = true;
    if (outputMediaTypes.has("audio")) result.audioOutput = true;
    if (outputMediaTypes.has("video")) result.videoOutput = true;
  }

  return result;
}

// =============================================================================
// Cost Estimation
// =============================================================================

/**
 * Model pricing structure with multimodal support.
 * All costs are in cents.
 *
 * Text costs: per 1M tokens
 * Image costs: per image
 * Audio costs: per minute
 * Video costs: per minute
 */
export interface ModelPricing {
  // Text token costs (per 1M tokens in cents)
  input: number; // Cost per 1M input tokens
  output: number; // Cost per 1M output tokens

  // Image costs (per image in cents) - optional
  imageInput?: number; // Cost per input image
  imageOutput?: number; // Cost per generated image

  // Audio costs (per minute in cents) - optional
  audioInput?: number; // Cost per minute of audio input
  audioOutput?: number; // Cost per minute of audio output

  // Video costs (per minute in cents) - optional
  videoInput?: number; // Cost per minute of video input
  videoOutput?: number; // Cost per minute of video output

  /*
   * Everything below refines the token bill. Each field is optional and its
   * absence means "no such charge" or "billed at the plain token rate", so a
   * catalog entry only names what its provider actually does differently.
   */

  /** Cached input tokens, cents per 1M. Absent: billed at `input`. */
  cachedInput?: number;
  /** Input tokens written to the prompt cache (OpenAI GPT-5.6+, Anthropic), cents per 1M. Absent: `input`. */
  cacheWriteInput?: number;
  /** Audio input tokens for providers that bill audio by the token, cents per 1M. Absent: `input`. */
  audioTokenInput?: number;
  /** Reasoning tokens billed apart from `output` (Perplexity deep research), cents per 1M. */
  reasoningTokens?: number;
  /** Citation tokens billed apart from `output` (Perplexity deep research), cents per 1M. */
  citationTokens?: number;
  /** Flat fee per API request, in cents. */
  requestFee?: number;
  /** Fee per web search call or search query, in cents. */
  searchCall?: number;
  /**
   * Higher rates once a single request's prompt reaches `minPromptTokens`.
   * Providers apply the higher rate to every token of that request.
   */
  longContext?: {
    minPromptTokens: number;
    input: number;
    output: number;
    cachedInput?: number;
  };
  /**
   * Announced rate changes. From `from` (an ISO date, UTC) the named rates
   * replace the ones above; the latest change already in effect wins.
   */
  priceChanges?: {
    from: string;
    input?: number;
    output?: number;
    cachedInput?: number;
  }[];
  /** Token rates are multiplied by `multiplier` inside any of these UTC windows. */
  peak?: {
    multiplier: number;
    /** `days` uses Date#getUTCDay (0 = Sunday); hours are [startHour, endHour). */
    windowsUtc: { days: number[]; startHour: number; endHour: number }[];
  };
}

/**
 * Multimodal usage input for cost estimation
 */
export interface MultimodalUsage {
  // Text tokens
  inputTokens?: number;
  outputTokens?: number;

  // Media counts/durations
  imagesInput?: number; // Number of input images
  imagesOutput?: number; // Number of generated images
  audioInputMinutes?: number; // Minutes of audio input
  audioOutputMinutes?: number; // Minutes of audio output
  videoInputMinutes?: number; // Minutes of video input
  videoOutputMinutes?: number; // Minutes of video output
}

/**
 * Estimate cost in cents for token usage (text only)
 *
 * Returned at full precision. A structured-output call on a small model costs
 * thousandths of a cent, so rounding here -- even to a hundredth of a cent --
 * moves the answer by half or zeroes it. Round only for display.
 *
 * @param pricing - Model pricing configuration
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 */
export function estimateCost(
  pricing: ModelPricing,
  inputTokens: number,
  outputTokens: number
): number {
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

/**
 * Estimate cost in cents for multimodal usage
 * @param pricing - Model pricing configuration
 * @param usage - Multimodal usage details
 */
export function estimateMultimodalCost(
  pricing: ModelPricing,
  usage: MultimodalUsage
): number {
  let totalCost = 0;

  // Text token costs
  if (usage.inputTokens) {
    totalCost += (usage.inputTokens / 1_000_000) * pricing.input;
  }
  if (usage.outputTokens) {
    totalCost += (usage.outputTokens / 1_000_000) * pricing.output;
  }

  // Image costs
  if (usage.imagesInput && pricing.imageInput) {
    totalCost += usage.imagesInput * pricing.imageInput;
  }
  if (usage.imagesOutput && pricing.imageOutput) {
    totalCost += usage.imagesOutput * pricing.imageOutput;
  }

  // Audio costs
  if (usage.audioInputMinutes && pricing.audioInput) {
    totalCost += usage.audioInputMinutes * pricing.audioInput;
  }
  if (usage.audioOutputMinutes && pricing.audioOutput) {
    totalCost += usage.audioOutputMinutes * pricing.audioOutput;
  }

  // Video costs
  if (usage.videoInputMinutes && pricing.videoInput) {
    totalCost += usage.videoInputMinutes * pricing.videoInput;
  }
  if (usage.videoOutputMinutes && pricing.videoOutput) {
    totalCost += usage.videoOutputMinutes * pricing.videoOutput;
  }

  return totalCost; // Full precision, as for estimateCost
}

/**
 * Format cost in cents to a readable string (e.g., "$0.0015" or "$1.50")
 */
export function formatCost(costCents: number): string {
  const dollars = costCents / 100;
  if (dollars < 0.01) {
    return `$${dollars.toFixed(4)}`;
  } else if (dollars < 1) {
    return `$${dollars.toFixed(3)}`;
  } else {
    return `$${dollars.toFixed(2)}`;
  }
}

/**
 * Format cost per million tokens for display
 */
export function formatCostPerMillion(pricing: ModelPricing): string {
  const inputDollars = pricing.input / 100;
  const outputDollars = pricing.output / 100;
  return `$${inputDollars.toFixed(2)} / $${outputDollars.toFixed(2)} per 1M tokens`;
}

// =============================================================================
// JSON Schema Type
// =============================================================================

export interface JsonSchema {
  type?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  description?: string;
  enum?: (string | number | boolean)[];
  default?: unknown;
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  additionalProperties?: boolean | JsonSchema;
  [key: string]: unknown;
}

// =============================================================================
// Entity Types (database models)
// =============================================================================

/**
 * @description ShapeShyft user account, linked to Firebase Authentication.
 * Created on first login and referenced by entity membership for multi-tenant access.
 */
export interface User {
  /** Internal database identifier */
  id: string;
  /** Firebase Authentication UID -- the primary external identity used to authenticate API requests */
  firebase_uid: string;
  /** User email address from Firebase Auth profile (may be null if auth provider omits it) */
  email: string | null;
  /** User display name from Firebase Auth profile */
  display_name: string | null;
  /** Timestamp when the user record was first created */
  created_at: Date | null;
  /** Timestamp of the most recent profile update */
  updated_at: Date | null;
}

/**
 * @description A ShapeShyft project that groups endpoints under a single API key.
 * Projects are scoped to an entity and serve as the top-level organizational unit
 * for managing AI endpoints.
 */
export interface Project {
  /** Unique identifier for this project */
  uuid: string;
  /** Entity (organization/personal) that owns this project */
  entity_id: string;
  /** URL-safe slug used in API paths (e.g., "my-project") */
  project_name: string;
  /** Human-readable project title shown in the UI */
  display_name: string;
  /** Optional description of the project's purpose */
  description: string | null;
  /** Whether this project is enabled; null treated as true */
  is_active: boolean | null;
  /** Truncated prefix of the project API key for display (e.g., "shyft_live_ab..."). Full key is never returned in Project responses. */
  api_key_prefix: string | null;
  /** Timestamp when the project API key was last generated or refreshed */
  api_key_created_at: Date | null;
  /** Timestamp when this project was created */
  created_at: Date | null;
  /** Timestamp of the most recent project update */
  updated_at: Date | null;
}

/**
 * Configuration for expected media output from an endpoint.
 * Used to configure models like GPT-4o (audio), Imagen (images), Veo (video).
 */
export interface MediaOutputConfig {
  /** Whether the endpoint expects audio output */
  audio?: boolean;
  /** Whether the endpoint expects image output */
  image?: boolean;
  /** Whether the endpoint expects video output */
  video?: boolean;
}

/**
 * @description Endpoint fields common to every product. Products add their provider binding.
 * Each endpoint defines a specific LLM interaction within a {@link Project}:
 * the model, schemas, instructions, and access controls. Callers invoke
 * endpoints via the project's API key.
 */
export interface EndpointBase {
  /** Unique identifier for this endpoint */
  uuid: string;
  /** Parent project UUID */
  project_id: string;
  /** URL-safe slug used in API paths (e.g., "analyze-text") */
  endpoint_name: string;
  /** Human-readable endpoint title shown in the UI */
  display_name: string;
  /** HTTP method accepted by this endpoint (GET for simple queries, POST for input payloads) */
  http_method: HttpMethod;
  /** LLM model identifier override; null uses the provider's default model */
  model: string | null;
  /** JSON Schema defining the expected input payload structure */
  input_schema: JsonSchema | null;
  /** JSON Schema defining the expected LLM output structure */
  output_schema: JsonSchema | null;
  /** System-level instructions prepended to the LLM prompt */
  instructions: string | null;
  /** Additional context appended to the LLM prompt for grounding */
  context: string | null;
  /** Whether this endpoint is enabled; null treated as true */
  is_active: boolean | null;
  /** Array of allowed IPv4 addresses. When null, all IPs are permitted (no restriction). */
  ip_allowlist: string[] | null;
  /** Declares which media types this endpoint is expected to generate (images, audio, video). Null means text-only output. */
  expects_media_output: MediaOutputConfig | null;
  /** Format for returning generated media: "base64" embeds data inline, "url" stores in cloud and returns a signed URL. Null means no media output. */
  output_media_format: "base64" | "url" | null;
  /** For audio/transcription endpoints (e.g., Whisper): the model used to extract structured data from the raw transcription text. Null means no post-processing. */
  transcription_extraction_model: string | null;
  /** Whether this endpoint uses web search for supported providers (OpenAI Responses API). */
  web_search: boolean;
  /**
   * Sampling temperature for this endpoint's model.
   *
   * `null` means **say nothing**, which is what every endpoint did before this
   * field existed, and the providers disagree about what that implies: OpenAI,
   * Gemini and Groq apply their own default of 0, while Anthropic omits the
   * parameter entirely because Opus 4.7+ and Sonnet 5 reject it outright. A 0
   * stored here is therefore a real choice — repeatable answers — and not the
   * same as leaving it unset.
   *
   * 0 to 2 is OpenAI's and Gemini's range; Anthropic's is 0 to 1.
   */
  temperature: number | null;
  /**
   * Ceiling on how many tokens the model may generate for one invocation.
   *
   * `null` means **no protection**: the generation runs until the model stops or
   * the provider severs the connection, and the caller pays for everything
   * produced on the way. Endpoints created before this field existed are null.
   *
   * A caller may lower this per invocation, never raise it -- see
   * {@link AiExecutionRequest}.
   */
  max_output_tokens: number | null;
  /** Lifetime number of invocations, counting both successes and failures. Incremented by the API on each call. */
  call_count: number;
  /** Timestamp when this endpoint was created */
  created_at: Date | null;
  /** Timestamp of the most recent endpoint update */
  updated_at: Date | null;
}

/**
 * @description A single API request log entry for usage tracking and billing.
 * One record is created per endpoint invocation, capturing token counts,
 * latency, cost, and caller metadata for analytics dashboards.
 */
export interface UsageAnalytics {
  /** Unique identifier for this analytics record */
  uuid: string;
  /** UUID of the endpoint that was invoked */
  endpoint_id: string;
  /** Timestamp when the request was received */
  timestamp: Date;
  /** Whether the LLM request completed successfully */
  success: boolean;
  /** Error message if the request failed; null on success */
  error_message: string | null;
  /** Number of input/prompt tokens consumed */
  tokens_input: number | null;
  /** Number of output/completion tokens generated */
  tokens_output: number | null;
  /** End-to-end request latency in milliseconds */
  latency_ms: number | null;
  /** Estimated cost of this request in cents (USD) */
  estimated_cost_cents: number | null;
  /** Arbitrary caller-supplied metadata (e.g., user_agent, ip, custom trace IDs). Stored as JSON and available for filtering in analytics queries. */
  request_metadata: Record<string, unknown> | null;
}

// =============================================================================
// Entity Storage Config Types
// =============================================================================

export type StorageProvider = "gcs" | "s3";

/**
 * Storage configuration for an entity (safe version without credentials).
 * Used for cloud storage of generated media.
 */
export interface EntityStorageConfig {
  uuid: string;
  entity_id: string;
  provider: StorageProvider;
  bucket: string;
  path_prefix: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

/**
 * GCS service account credentials
 */
export interface GCSCredentials {
  type: "service_account";
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
}

/**
 * AWS S3 credentials
 */
export interface S3Credentials {
  access_key_id: string;
  secret_access_key: string;
  region: string;
}

export type StorageCredentials = GCSCredentials | S3Credentials;

/**
 * Request to create or update storage configuration
 */
export interface StorageConfigCreateRequest {
  provider: StorageProvider;
  bucket: string;
  path_prefix?: string;
  credentials: StorageCredentials;
}

export interface StorageConfigUpdateRequest {
  bucket?: string;
  path_prefix?: string | null;
  credentials?: StorageCredentials;
}

/**
 * @description User-level settings and organization preferences.
 * Every authenticated user has settings; if none have been saved yet,
 * the API returns auto-generated defaults with `is_default: true`.
 */
export interface UserSettings {
  /** Database row ID; null when settings are auto-generated defaults not yet persisted */
  id: string | null;
  /** Firebase Authentication UID linking these settings to a {@link User} */
  firebase_uid: string;
  /** Display name of the user's organization; null if not set */
  organization_name: string | null;
  /** URL-safe organization path used in routing (auto-generated from UID if not customized) */
  organization_path: string;
  /** Computed field (not stored in DB): true if settings are auto-generated defaults */
  is_default: boolean;
  /** Timestamp when these settings were first saved */
  created_at: Date | null;
  /** Timestamp of the most recent settings update */
  updated_at: Date | null;
}

/**
 * @description A personal API key that authenticates its owner against the
 * admin routes, as an alternative to a Firebase ID token. A user may hold
 * several. The secret itself is never present on this type -- see
 * {@link UserApiKeyCreated} and {@link UserApiKeyRevealed} for the two responses
 * that carry it.
 *
 * Not to be confused with a *project* API key (`sk_live_...`), which
 * authenticates callers of a published AI endpoint. Personal keys are prefixed
 * `shyft_`.
 */
export interface UserApiKey {
  /** Unique identifier for this key record */
  uuid: string;
  /** Firebase UID of the owner */
  firebase_uid: string;
  /** Human-readable label, e.g. "CLI on my laptop" */
  key_name: string;
  /** First characters of the key, for display (e.g. "shyft_ab12cd") */
  key_prefix: string;
  /** Whether the key is accepted; a deactivated key fails authentication */
  is_active: boolean;
  /** ISO 8601 timestamp of the most recent authenticated request, or null if unused */
  last_used_at: string | null;
  /** ISO 8601 timestamp when the key was created */
  created_at: string | null;
  /** ISO 8601 timestamp of the most recent update */
  updated_at: string | null;
}

/**
 * @description Response from creating a personal API key. This is the only
 * response that returns the secret without being asked, and the value cannot be
 * derived from any other endpoint except {@link UserApiKeyRevealed}.
 */
export interface UserApiKeyCreated extends UserApiKey {
  /** The full `shyft_...` key */
  api_key: string;
}

/** @description Response from revealing an existing personal API key. */
export interface UserApiKeyRevealed {
  /** The full `shyft_...` key */
  api_key: string;
}

/**
 * @description Identity of the authenticated caller, from `GET /users/me`.
 * The only way an API-key client can learn its own Firebase UID, which the
 * `/users/:userId/*` routes require.
 */
export interface CurrentUser {
  /** Firebase UID of the caller */
  firebase_uid: string;
  /** Caller's email, or null when unavailable */
  email: string | null;
  /** Whether the caller is a site admin */
  siteAdmin: boolean;
  /** Which credential authenticated this request */
  auth_method: "firebase" | "api_key";
  /** Display name from the Firebase profile, or null */
  display_name: string | null;
}

// =============================================================================
// Request Body Types
// =============================================================================

// User requests
export interface UserCreateRequest {
  firebase_uid: string;
  email: Optional<string>;
  display_name: Optional<string>;
}

export interface UserUpdateRequest {
  email: Optional<string>;
  display_name: Optional<string>;
}

// User Settings requests
export interface UserApiKeyCreateRequest {
  key_name: string;
}

export interface UserApiKeyUpdateRequest {
  key_name: Optional<string>;
  is_active: Optional<boolean>;
}

export interface UserSettingsUpdateRequest {
  organization_name: Optional<string>;
  organization_path: Optional<string>;
}

// Project requests
export interface ProjectCreateRequest {
  project_name: string;
  display_name: string;
  description: Optional<string>;
}

export interface ProjectUpdateRequest {
  project_name: Optional<string>;
  display_name: Optional<string>;
  description: Optional<string>;
  is_active: Optional<boolean>;
}

// Endpoint requests
export interface EndpointCreateRequestBase {
  endpoint_name: string;
  display_name: string;
  http_method: Optional<HttpMethod>;
  model: Optional<string>;
  input_schema: Optional<JsonSchema>;
  output_schema: Optional<JsonSchema>;
  instructions: Optional<string>;
  context: Optional<string>;
  expects_media_output?: Optional<MediaOutputConfig>;
  output_media_format?: Optional<"base64" | "url">;
  transcription_extraction_model?: Optional<string>;
  web_search?: Optional<boolean>;
  /** Sampling temperature (0-2). Omit or pass null to leave it to the provider. */
  temperature?: Optional<number>;
  /**
   * Output ceiling for this endpoint. Omit to receive
   * {@link DEFAULT_MAX_OUTPUT_TOKENS}; pass `null` to explicitly opt out of
   * runaway protection.
   */
  max_output_tokens?: Optional<number>;
}

export interface EndpointUpdateRequestBase {
  endpoint_name?: Optional<string>;
  display_name?: Optional<string>;
  http_method?: Optional<HttpMethod>;
  model?: Optional<string>;
  input_schema?: Optional<JsonSchema>;
  output_schema?: Optional<JsonSchema>;
  instructions?: Optional<string>;
  context?: Optional<string>;
  is_active?: Optional<boolean>;
  ip_allowlist?: Optional<string[]>;
  expects_media_output?: Optional<MediaOutputConfig>;
  output_media_format?: Optional<"base64" | "url">;
  transcription_extraction_model?: Optional<string>;
  web_search?: Optional<boolean>;
  /** Sampling temperature (0-2). `null` clears it, leaving sampling to the provider. */
  temperature?: Optional<number>;
  /**
   * Output ceiling for this endpoint. Omit to leave unchanged; pass `null` to
   * remove the ceiling.
   */
  max_output_tokens?: Optional<number>;
}

// =============================================================================
// Query Parameter Types
// =============================================================================

/**
 * Utility type for boolean-like query string parameters.
 * URL query params are always strings, so boolean values are represented
 * as the literal strings `'true'` or `'false'`, or `undefined` when absent.
 */
export type BooleanQueryParam = "true" | "false" | undefined;

export interface ProjectQueryParams {
  is_active: BooleanQueryParam;
}

export interface EndpointQueryParams {
  is_active: BooleanQueryParam;
}

export interface UsageAnalyticsQueryParams {
  endpoint_id: Optional<string>;
  project_id: Optional<string>;
  start_date: Optional<string>;
  end_date: Optional<string>;
  success: BooleanQueryParam;
}

// =============================================================================
// Analytics Aggregation Types
// =============================================================================

export interface UsageAggregate {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  total_tokens_input: number;
  total_tokens_output: number;
  total_estimated_cost_cents: number;
  average_latency_ms: number;
}

export interface UsageByEndpoint extends UsageAggregate {
  endpoint_id: string;
  endpoint_name: string;
}

export interface UsageByDate extends UsageAggregate {
  date: string;
}

/** Compound response from analytics API endpoint */
export interface AnalyticsResponse {
  aggregate: UsageAggregate;
  by_endpoint: UsageByEndpoint[];
}

// =============================================================================
// LLM Request/Response Types
// =============================================================================

export interface LlmRequest {
  prompt: string;
  system_prompt: Optional<string>;
  output_schema: JsonSchema;
  model: Optional<string>;
  temperature: Optional<number>;
  max_tokens: Optional<number>;
}

export interface LlmResponse {
  content: unknown;
  raw_response: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  provider: LlmProvider;
}

// =============================================================================
// AI Endpoint Execution Types
// =============================================================================

/**
 * Why the model stopped generating, normalized across providers.
 *
 * Providers spell this differently -- OpenAI `finish_reason`, Anthropic
 * `stop_reason`, Gemini `finishReason` -- and use different vocabularies. These
 * are the normalized values ShapeShyft reports.
 */
export const FINISH_REASONS = [
  /** The model finished on its own. */
  "stop",
  /** The output ceiling was reached; the answer is truncated and likely invalid. */
  "length",
  /** The provider's safety system stopped generation. */
  "content_filter",
  /** The model stopped to call a tool. */
  "tool_calls",
  /** The provider reported a reason ShapeShyft does not recognize. */
  "other",
] as const;

/** Why the model stopped generating. See {@link FINISH_REASONS}. */
export type FinishReason = (typeof FINISH_REASONS)[number];

/**
 * Output ceiling applied to newly created endpoints when none is supplied.
 *
 * Chosen to be comfortably above a normal structured answer while still turning
 * a runaway generation into a failure measured in seconds rather than the
 * ~15 minutes a provider timeout takes. Endpoints may raise it, lower it, or set
 * it to `null` to opt out entirely.
 *
 * This is a default for *new* endpoints only. It is never applied retroactively:
 * an endpoint whose `max_output_tokens` is already `null` stays unprotected.
 */
export const DEFAULT_MAX_OUTPUT_TOKENS = 8000;

export interface AiExecutionRequest {
  input: unknown;
  /**
   * Lower the endpoint's output ceiling for this one call.
   *
   * Clamped to the endpoint's own ceiling, so this can only ever ask for
   * *fewer* tokens -- it is not a way to escape an operator's limit. Ignored
   * when the endpoint has no ceiling of its own.
   */
  max_output_tokens?: Optional<number>;
}

export interface AiExecutionResponse {
  output: unknown;
  usage: {
    tokens_input: number;
    tokens_output: number;
    /**
     * The part of `tokens_input` the provider served from its prompt cache,
     * billed at the cached rate. Absent when nothing was cached or the
     * provider reports no such figure -- which is not the same as "cache
     * disabled": DeepSeek and OpenAI cache automatically and report it.
     */
    tokens_cached_input?: number;
    latency_ms: number;
    estimated_cost_cents: number;
    /**
     * Why the model stopped. Absent when the provider did not report one.
     * `'length'` means the answer was cut off at the ceiling, which is the
     * difference between "the model ran away" and "the model returned
     * something unparseable" -- different faults with different correct fixes.
     */
    finish_reason?: FinishReason;
  };
  /**
   * True when generation stopped at a token ceiling. `output` is then a
   * truncated answer that will usually fail schema validation.
   */
  truncated?: boolean;
  /** Generated media (images, audio, video) from generative models */
  generated_media?: GeneratedMedia[];
}

/**
 * A provider HTTP request, described rather than sent: what a caller holding
 * its own provider key needs to make the same call ShapeShyft's invoke makes.
 *
 * The key itself is never part of it. Send it in `auth.header` as
 * `auth.prefix + apiKey`, beside `headers`.
 */
export interface AiProviderRequest {
  provider: LlmProvider;
  model: string;
  method: "POST";
  /** Full chat URL. */
  url: string;
  /** Non-secret headers, e.g. `content-type`, `anthropic-version`. */
  headers: Record<string, string>;
  /**
   * Where the key goes. OpenAI-compatible: `{ header: "Authorization",
   * prefix: "Bearer " }`. Anthropic: `{ header: "x-api-key", prefix: "" }`.
   */
  auth: { header: string; prefix: string };
  /** JSON body, exactly what invoke sends to the provider. */
  body: Record<string, unknown>;
}

/** Response from /prompt endpoint - returns the generated prompt */
export interface AiPromptResponse {
  /** Human-readable, pasteable prompt. Always present. */
  prompt: string;
  /**
   * The provider request invoke would make. Present only when the caller
   * passed `llm_provider`.
   */
  request?: AiProviderRequest;
}

// =============================================================================
// API Key Types
// =============================================================================

/** Response when refreshing/generating a project API key */
export interface RefreshApiKeyResponse {
  /** Full API key (only returned on generation/refresh) */
  api_key: string;
  /** Key prefix for display (e.g., "sk_live_ab...") */
  api_key_prefix: string;
  /** When the key was created/refreshed */
  api_key_created_at: string;
}

/** Response when fetching the full API key */
export interface GetApiKeyResponse {
  /** Full decrypted API key */
  api_key: string;
}

// =============================================================================
// ApiHelper Types
// =============================================================================

/** Input for ApiHelper.prompt() */
export interface PromptInput {
  inputData: unknown;
  outputSchema: JsonSchema | null;
  instructions: string | null;
  context: string | null;
  provider: LlmProvider;
}

/** Input for ApiHelper.request() */
export interface ApiHelperRequestInput {
  prompt: string;
  outputSchema: JsonSchema;
  provider: LlmProvider;
  providerConfig: {
    apiKey?: string;
    endpointUrl?: string;
    model?: string;
  };
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

/** Output from ApiHelper.request() */
export interface ApiHelperRequestOutput {
  apiPayload: Record<string, unknown>;
  endpointUrl: string;
  provider: LlmProvider;
}

// =============================================================================
// Response Helper Functions
// =============================================================================

/**
 * Create a typed success response wrapping the given data.
 *
 * @example
 * ```typescript
 * import { successResponse, type Project } from './index.js';
 *
 * const project: Project = { uuid: '...', entity_id: '...', project_name: 'my-project', display_name: 'My Project', description: null, is_active: true, api_key_prefix: null, api_key_created_at: null, created_at: new Date(), updated_at: new Date() };
 * const response = successResponse<Project>(project);
 * // { success: true, data: { uuid: '...', project_name: 'my-project', ... }, timestamp: '2026-01-15T...' }
 * ```
 */
export function successResponse<T>(data: T): BaseResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a typed error response with the given error message.
 *
 * @example
 * ```typescript
 * import { errorResponse } from './index.js';
 *
 * const response = errorResponse('Project not found');
 * // { success: false, error: 'Project not found', timestamp: '2026-01-15T...' }
 *
 * // In an API handler:
 * if (!project) {
 *   return c.json(errorResponse('Project not found'), 404);
 * }
 * ```
 */
export function errorResponse(error: string): BaseResponse<never> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}

// =============================================================================
// API Response Type Aliases (for FE client convenience)
// =============================================================================

// Entity list responses
export type ProjectListResponse = BaseResponse<Project[]>;

// Single entity responses
export type ProjectResponse = BaseResponse<Project>;
export type UserSettingsResponse = BaseResponse<UserSettings>;

// Analytics response
export type AnalyticsApiResponse = BaseResponse<AnalyticsResponse>;

// AI execution responses
export type AiExecutionApiResponse = BaseResponse<AiExecutionResponse>;
export type AiPromptApiResponse = BaseResponse<AiPromptResponse>;

// API Key responses
export type RefreshApiKeyApiResponse = BaseResponse<RefreshApiKeyResponse>;
export type GetApiKeyApiResponse = BaseResponse<GetApiKeyResponse>;
export type UserApiKeyListResponse = BaseResponse<UserApiKey[]>;
export type UserApiKeyResponse = BaseResponse<UserApiKey>;
export type UserApiKeyCreatedResponse = BaseResponse<UserApiKeyCreated>;
export type UserApiKeyRevealedResponse = BaseResponse<UserApiKeyRevealed>;
export type CurrentUserResponse = BaseResponse<CurrentUser>;

// Health check response
export type HealthCheckResponse = BaseResponse<HealthCheckData>;

// =============================================================================
// Health check response
// =============================================================================

export interface HealthCheckData {
  name: string;
  version: string;
  status: string;
}

// =============================================================================
// Provider API Types (for GET /providers endpoints)
// =============================================================================

/**
 * Provider configuration returned from the API
 */
export interface ProviderConfig {
  id: LlmProvider;
  name: string;
  description: string;
  allowsCustomModel: boolean;
  defaultModel: string;
  requiresEndpointUrl: boolean;
}

/**
 * Model information with capabilities and pricing
 */
export interface ModelInfo {
  id: string;
  capabilities: ModelCapabilities;
  pricing: ModelPricing;
}

/**
 * Response from GET /providers/:provider/models
 */
export interface ProviderModelsResponse {
  provider: ProviderConfig;
  models: ModelInfo[];
}

// Provider API response type aliases
export type ProviderListResponse = BaseResponse<ProviderConfig[]>;
export type ProviderResponse = BaseResponse<ProviderConfig>;
export type ProviderModelsApiResponse = BaseResponse<ProviderModelsResponse>;
