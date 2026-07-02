export const GEMINI_MODELS = [
  {
    id: 'gemini-2.0-flash',
    label: 'Gemini 2.0 Flash',
    inputPerMillionUsd: 0.1,
    outputPerMillionUsd: 0.4,
  },
  {
    id: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    inputPerMillionUsd: 0.3,
    outputPerMillionUsd: 2.5,
  },
  {
    id: 'gemini-2.5-flash-lite',
    label: 'Gemini 2.5 Flash Lite',
    inputPerMillionUsd: 0.1,
    outputPerMillionUsd: 0.4,
  },
  {
    id: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    inputPerMillionUsd: 1.25,
    outputPerMillionUsd: 10.0,
  },
];

export const DEFAULT_USD_TO_MYR = 4.47;

export function getModelPricing(modelId) {
  return GEMINI_MODELS.find((model) => model.id === modelId) ?? GEMINI_MODELS[0];
}

export function calculateCostUsd(inputTokens, outputTokens, modelId) {
  const pricing = getModelPricing(modelId);
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPerMillionUsd;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPerMillionUsd;
  return inputCost + outputCost;
}

export function calculateCostMyr(inputTokens, outputTokens, modelId, usdToMyr) {
  return calculateCostUsd(inputTokens, outputTokens, modelId) * usdToMyr;
}

export function formatMyr(amount) {
  return `RM ${amount.toFixed(4)}`;
}

export function formatTokens(count) {
  return count.toLocaleString();
}
