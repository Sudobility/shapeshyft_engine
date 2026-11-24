/**
 * @fileoverview Provider URLs
 * @description Where each provider's chat API lives. Pure data, so both the
 * SDK adapters and the RN-safe `./core` entry read the same values.
 */

import type { LlmProvider } from "../types/index.js";

/**
 * OpenAI-SDK base URLs for OpenAI-compatible providers (no /chat/completions --
 * the SDK appends the path). Used by the factory so these providers reach their
 * own API rather than api.openai.com.
 */
export const OPENAI_COMPATIBLE_BASE_URLS: Partial<Record<LlmProvider, string>> =
  {
    mistral: "https://api.mistral.ai/v1",
    xai: "https://api.x.ai/v1",
    deepseek: "https://api.deepseek.com/v1",
    perplexity: "https://api.perplexity.ai",
    cohere: "https://api.cohere.ai/compatibility/v1",
    openrouter: "https://openrouter.ai/api/v1",
  };

/**
 * Provider endpoint hints for Type 3/4 endpoints, and the URL
 * `buildProviderRequest` returns.
 */
export const PROVIDER_ENDPOINTS: Record<LlmProvider, string> = {
  openai: "https://api.openai.com/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/messages",
  gemini:
    "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
  mistral: "https://api.mistral.ai/v1/chat/completions",
  cohere: "https://api.cohere.ai/compatibility/v1/chat/completions",
  groq: "https://api.groq.com/openai/v1/chat/completions",
  xai: "https://api.x.ai/v1/chat/completions",
  deepseek: "https://api.deepseek.com/v1/chat/completions",
  perplexity: "https://api.perplexity.ai/chat/completions",
  lm_studio: "{custom_endpoint}",
  jev: "https://api.typesafe.ai/v1/systemone",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  // Image-generation providers. These are image-generation submit endpoints,
  // not chat APIs; the real calls (model-dependent paths, polling, multipart)
  // are made by each product's image-provider wrapper.
  bytedance:
    "https://ark.ap-southeast.bytepluses.com/api/v3/images/generations",
  bfl: "https://api.bfl.ai/v1/{model}",
  ideogram: "https://api.ideogram.ai/v2/image/generate/ideogram-3",
  recraft: "https://external.api.recraft.ai/v1/images/generations",
  stability: "https://api.stability.ai/v2beta/stable-image/generate/{model}",
  // Image aggregator / more image vendors.
  fal: "https://fal.run/{model}",
  leonardo: "https://cloud.leonardo.ai/api/rest/v1/generations",
  luma: "https://api.lumalabs.ai/dream-machine/v1/generations/image",
  alibaba:
    "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
  runway: "https://api.dev.runwayml.com/v1/text_to_image",
  // Video-generation providers.
  kling: "https://api-singapore.klingai.com/text-to-video/{model}",
  minimax: "https://api.minimax.io/v1/video_generation",
  pika: "https://api.dev.pika.art/v1/media/{model}",
  // Audio-generation provider (text-to-speech).
  elevenlabs: "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
};

/** The `anthropic-version` header the Messages API requires. */
export const ANTHROPIC_VERSION = "2023-06-01";
