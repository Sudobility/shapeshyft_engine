/**
 * @fileoverview LLM provider factory and exports
 * @description Creates the appropriate LLM provider instance based on provider type.
 * OpenAI-compatible providers (Mistral, xAI, DeepSeek, Perplexity, Cohere,
 * OpenRouter) reuse
 * the OpenAIProvider class, each with its own base URL. Groq has a dedicated provider for Whisper transcription.
 */

import type { LlmProvider } from "../../types/index.js";
import type { ILLMProvider, ProviderConfig } from "./types.js";
import { OpenAIProvider } from "./openai.js";
import { AnthropicProvider } from "./anthropic.js";
import { GeminiProvider } from "./gemini.js";
import { GroqProvider } from "./groq.js";
import { CustomLLMProvider } from "./custom.js";
import { JevProvider } from "./jev.js";
import { MediaOnlyProvider } from "./image-only.js";
import { OPENAI_COMPATIBLE_BASE_URLS } from "../../core/endpoints.js";
import { openAIChatDialect } from "../../core/payload.js";

export type {
  ILLMProvider,
  LLMRequest,
  LLMResponse,
  LLMUsage,
  ProviderConfig,
} from "./types.js";
export { estimateCost, getModelPricing } from "./types.js";

/**
 * Create an LLM provider instance based on provider type
 */
export function createLLMProvider(
  providerType: LlmProvider,
  config: ProviderConfig
): ILLMProvider {
  switch (providerType) {
    case "openai":
      // The only caller that is OpenAI itself: its newer models name the output
      // cap `max_completion_tokens`, which the compatible providers do not know.
      return new OpenAIProvider(config, openAIChatDialect("openai"));
    case "anthropic":
      return new AnthropicProvider(config);
    case "gemini":
      return new GeminiProvider(config);
    case "groq":
      return new GroqProvider(config); // Groq has dedicated provider for Whisper
    // Providers with OpenAI-compatible API format. Supply the provider's own
    // base URL so requests don't fall through to api.openai.com.
    case "mistral":
    case "xai":
    case "perplexity":
    case "openrouter":
      return new OpenAIProvider({
        ...config,
        endpointUrl:
          config.endpointUrl ?? OPENAI_COMPATIBLE_BASE_URLS[providerType],
      });
    /*
      DeepSeek V4 reasons by default, and thinking mode rejects `tool_choice`.

      Turning thinking off restores function calling — and is the right trade
      anyway: measured on the same two-bar plan, 844 output tokens and 8.6s
      with thinking against 126 tokens and 2.4s without, for an answer of the
      same size. The reasoning is discarded, so it was working the caller paid
      for and never saw.
    */
    case "deepseek":
      return new OpenAIProvider(
        {
          ...config,
          endpointUrl:
            config.endpointUrl ?? OPENAI_COMPATIBLE_BASE_URLS[providerType],
        },
        openAIChatDialect("deepseek")
      );
    /*
      Cohere's native Chat API has its own request and response shape, but its
      Compatibility API speaks OpenAI's -- except that it takes no
      `tool_choice`, so structured output goes through `response_format`.
      https://docs.cohere.com/docs/compatibility-api
    */
    case "cohere":
      return new OpenAIProvider(
        {
          ...config,
          endpointUrl:
            config.endpointUrl ?? OPENAI_COMPATIBLE_BASE_URLS[providerType],
        },
        openAIChatDialect("cohere")
      );
    case "lm_studio":
      return new CustomLLMProvider(config);
    case "jev":
      return new JevProvider(config);
    // Media-generation providers (image, video, audio). The engine returns a
    // stub; the real API calls are made by each product's media/image-provider
    // wrapper, which intercepts media requests before they reach this base
    // provider. (xAI's image path is layered on in that wrapper too, but xAI is
    // a full text provider above, so it is not listed here.)
    case "bytedance":
    case "bfl":
    case "ideogram":
    case "recraft":
    case "stability":
    case "fal":
    case "leonardo":
    case "luma":
    case "alibaba":
    case "runway":
    case "kling":
    case "minimax":
    case "pika":
    case "elevenlabs":
      return new MediaOnlyProvider(providerType);
    default:
      throw new Error(`Unknown provider type: ${providerType}`);
  }
}

export { PROVIDER_ENDPOINTS } from "../../core/endpoints.js";
