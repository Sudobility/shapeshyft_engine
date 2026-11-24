/**
 * @fileoverview Media-only provider stub
 * @description Some providers generate media (images, video or audio) rather
 * than text or structured JSON -- ByteDance Seedream, Black Forest Labs FLUX,
 * Ideogram, Recraft, Stability, fal.ai, Leonardo, Luma, Alibaba Qwen-Image and
 * Runway (image); Kling, MiniMax and Pika (video); ElevenLabs (audio). Their
 * real API calls are made by each product's media/image-provider wrapper (e.g.
 * shapeshyft_api/src/image-provider.ts), which intercepts requests whose
 * `expectsMediaOutput.{image,audio,video}` is set before they reach the base
 * provider.
 *
 * This stub is what the engine factory returns for those providers so the rest
 * of the engine (catalog, validation, the factory's exhaustiveness) treats them
 * uniformly. If `generate()` is ever reached it means a media request was not
 * routed to the wrapper, or a text request was sent to a media-only provider --
 * both are configuration errors, so it throws.
 *
 * `ImageOnlyProvider` is kept as an alias for backwards compatibility.
 */

import type { LlmProvider } from "../../types/index.js";
import type { ILLMProvider, LLMRequest, LLMResponse } from "./types.js";

export class MediaOnlyProvider implements ILLMProvider {
  readonly providerName: LlmProvider;

  constructor(providerName: LlmProvider) {
    this.providerName = providerName;
  }

  generate(_request: LLMRequest): Promise<LLMResponse> {
    throw new Error(
      `${this.providerName} is a media-generation provider: requests must set ` +
        `expectsMediaOutput and be served by the media-provider wrapper, ` +
        `not the base LLM provider`
    );
  }

  buildApiPayload(_request: LLMRequest): Record<string, unknown> {
    throw new Error(
      `${this.providerName} is a media-generation provider and has no chat API payload`
    );
  }
}

/** @deprecated Use {@link MediaOnlyProvider}. */
export const ImageOnlyProvider = MediaOnlyProvider;
