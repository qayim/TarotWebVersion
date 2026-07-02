import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  calculateCostMyr,
  DEFAULT_USD_TO_MYR,
  formatMyr,
} from '../utils/pricing';

const STORAGE_KEY = 'tarot-gemini-settings';

const defaultUsage = {
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  totalCostMyr: 0,
  requestCount: 0,
};

const defaultLastRequest = null;

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export const GeminiSettingsContext = createContext(null);

export default function GeminiSettingsProvider({ children }) {
  const stored = loadSettings();

  const [apiKey, setApiKey] = useState(stored?.apiKey ?? '');
  const [model, setModel] = useState(stored?.model ?? 'gemini-2.0-flash');
  const [usdToMyr, setUsdToMyr] = useState(stored?.usdToMyr ?? DEFAULT_USD_TO_MYR);
  const [usage, setUsage] = useState(stored?.usage ?? defaultUsage);
  const [lastRequest, setLastRequest] = useState(stored?.lastRequest ?? defaultLastRequest);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ apiKey, model, usdToMyr, usage, lastRequest })
    );
  }, [apiKey, model, usdToMyr, usage, lastRequest]);

  function recordUsage({ inputTokens, outputTokens, totalTokens, model: usedModel }) {
    const requestCostMyr = calculateCostMyr(
      inputTokens,
      outputTokens,
      usedModel ?? model,
      usdToMyr
    );

    setUsage((current) => ({
      inputTokens: current.inputTokens + inputTokens,
      outputTokens: current.outputTokens + outputTokens,
      totalTokens: current.totalTokens + totalTokens,
      totalCostMyr: current.totalCostMyr + requestCostMyr,
      requestCount: current.requestCount + 1,
    }));

    setLastRequest({
      inputTokens,
      outputTokens,
      totalTokens,
      costMyr: requestCostMyr,
      model: usedModel ?? model,
      at: new Date().toISOString(),
    });

    return requestCostMyr;
  }

  function resetUsage() {
    setUsage(defaultUsage);
    setLastRequest(defaultLastRequest);
  }

  const value = useMemo(
    () => ({
      apiKey,
      setApiKey,
      model,
      setModel,
      usdToMyr,
      setUsdToMyr,
      usage,
      lastRequest,
      recordUsage,
      resetUsage,
      formattedTotalCost: formatMyr(usage.totalCostMyr),
      formattedLastCost: lastRequest ? formatMyr(lastRequest.costMyr) : null,
    }),
    [apiKey, model, usdToMyr, usage, lastRequest]
  );

  return (
    <GeminiSettingsContext.Provider value={value}>
      {children}
    </GeminiSettingsContext.Provider>
  );
}

export function useGeminiSettings() {
  const context = useContext(GeminiSettingsContext);
  if (!context) {
    throw new Error('useGeminiSettings must be used within GeminiSettingsProvider');
  }
  return context;
}
