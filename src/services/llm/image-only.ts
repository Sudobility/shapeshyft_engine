/**
 * @fileoverview Image-only provider stub
 * @description Some providers (ByteDance Seedream, Black Forest Labs FLUX,
 * Ideogram, Recraft, Stability) generate images rather than text or structured
 * JSON. Their real API calls are made by each product's image-provider wrapper
 * (e.g. shapeshyft_api/src/image-provider.ts), which intercepts requests whose
 * `expectsMediaOutput.image` is set before they reach the base provider.
 *
 * This stub is what the engine factory returns for those providers so the rest
 * of the engine (catalog, validation, the factory's exhaustiveness) treats them
 * uniformly. If `generate()` is ever reached it means an image request was not
 * routed to the image-provider wrapper, or a text request was sent to an
 * image-only provider -- both are configuration errors, so it throws.
 */

import type { LlmProvider } from "../../types/index.js";
import type { ILLMProvider, LLMRequest, LLMResponse } from "./types.js";

export class ImageOnlyProvider implements ILLMProvider {
  readonly providerName: LlmProvider;

  constructor(providerName: LlmProvider) {
    this.providerName = providerName;
  }

  generate(_request: LLMRequest): Promise<LLMResponse> {
    throw new Error(
      `${this.providerName} is an image-generation provider: requests must set ` +
        `expectsMediaOutput.image and be served by the image-provider wrapper, ` +
        `not the base LLM provider`
    );
  }

  buildApiPayload(_request: LLMRequest): Record<string, unknown> {
    throw new Error(
      `${this.providerName} is an image-generation provider and has no chat API payload`
    );
  }
}
