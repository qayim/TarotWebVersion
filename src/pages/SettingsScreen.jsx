import TopBar from '../components/TopBar';
import { useGeminiSettings } from '../context/GeminiSettingsContext';
import { formatMyr, formatTokens, GEMINI_MODELS, DEFAULT_USD_TO_MYR } from '../utils/pricing';
import './SettingsScreen.css';

function formatRequestTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString();
}

export default function SettingsScreen() {
  const {
    apiKey,
    setApiKey,
    model,
    setModel,
    usdToMyr,
    setUsdToMyr,
    usage,
    lastRequest,
    resetUsage,
    formattedTotalCost,
    formattedLastCost,
  } = useGeminiSettings();

  const selectedModel = GEMINI_MODELS.find((entry) => entry.id === model) ?? GEMINI_MODELS[0];

  return (
    <main className="screen">
      <div className="screen-content settings">
        <TopBar title="Gemini Settings" showBack />

        <section className="settings__panel">
          <h2 className="settings__heading">API Configuration</h2>
          <p className="settings__note">
            Your API key is stored only in this browser. Get a key from{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
            >
              Google AI Studio
            </a>
            .
          </p>

          <label className="settings__field">
            <span>Gemini API Key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Paste your API key"
              autoComplete="off"
            />
          </label>

          <label className="settings__field">
            <span>Model</span>
            <select value={model} onChange={(event) => setModel(event.target.value)}>
              {GEMINI_MODELS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>

          <label className="settings__field">
            <span>USD → MYR rate</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={usdToMyr}
              onChange={(event) => setUsdToMyr(Number(event.target.value) || DEFAULT_USD_TO_MYR)}
            />
          </label>

          <p className="settings__pricing">
            Current model: ${selectedModel.inputPerMillionUsd} / 1M input · $
            {selectedModel.outputPerMillionUsd} / 1M output (USD)
          </p>
        </section>

        <section className="settings__panel">
          <h2 className="settings__heading">Token Usage & Cost</h2>

          {lastRequest ? (
            <div className="settings__last">
              <h3 className="settings__subheading">Last reading</h3>
              <div className="settings__stats">
                <div className="settings__stat">
                  <span className="settings__stat-label">Input tokens</span>
                  <strong>{formatTokens(lastRequest.inputTokens)}</strong>
                </div>
                <div className="settings__stat">
                  <span className="settings__stat-label">Output tokens</span>
                  <strong>{formatTokens(lastRequest.outputTokens)}</strong>
                </div>
                <div className="settings__stat">
                  <span className="settings__stat-label">Total tokens</span>
                  <strong>{formatTokens(lastRequest.totalTokens)}</strong>
                </div>
                <div className="settings__stat settings__stat--highlight">
                  <span className="settings__stat-label">Cost (MYR)</span>
                  <strong>{formattedLastCost}</strong>
                </div>
              </div>
              <p className="settings__meta">
                Model: {lastRequest.model} · {formatRequestTime(lastRequest.at)}
              </p>
            </div>
          ) : (
            <p className="settings__note">No readings yet. Token usage will appear here after your first Gemini reading.</p>
          )}

          <h3 className="settings__subheading">All time</h3>
          <div className="settings__stats">
            <div className="settings__stat">
              <span className="settings__stat-label">Input tokens</span>
              <strong>{formatTokens(usage.inputTokens)}</strong>
            </div>
            <div className="settings__stat">
              <span className="settings__stat-label">Output tokens</span>
              <strong>{formatTokens(usage.outputTokens)}</strong>
            </div>
            <div className="settings__stat">
              <span className="settings__stat-label">Total tokens</span>
              <strong>{formatTokens(usage.totalTokens)}</strong>
            </div>
            <div className="settings__stat settings__stat--highlight">
              <span className="settings__stat-label">Total cost (MYR)</span>
              <strong>{formattedTotalCost}</strong>
            </div>
            <div className="settings__stat">
              <span className="settings__stat-label">Readings generated</span>
              <strong>{usage.requestCount}</strong>
            </div>
          </div>

          <button className="settings__reset" type="button" onClick={resetUsage}>
            Reset usage stats
          </button>
        </section>
      </div>
    </main>
  );
}
