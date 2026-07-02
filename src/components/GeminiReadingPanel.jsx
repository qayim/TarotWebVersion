import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGeminiSettings } from '../context/GeminiSettingsContext';
import { generateReadingAidReading } from '../services/gemini';
import CategoryButton from './CategoryButton';
import ReadingDisplay from './ReadingDisplay';
import './GeminiReadingPanel.css';

export default function GeminiReadingPanel({ spread, idPrefix = 'gemini' }) {
  const { apiKey, model, recordUsage } = useGeminiSettings();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canAsk =
    open && question.trim().length > 0 && apiKey.trim().length > 0 && spread.length > 0 && !loading;

  async function askGemini() {
    setError('');
    setLoading(true);

    try {
      const result = await generateReadingAidReading({
        apiKey,
        model,
        question,
        spread,
      });

      recordUsage(result.usage);
      setReading(result.text);
    } catch (requestError) {
      setError(requestError.message ?? 'Something went wrong while asking Gemini.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gemini-panel">
      <button
        className="gemini-panel__toggle"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="gemini-panel__toggle-label">Ask Gemini (optional)</span>
        <span className="gemini-panel__toggle-icon">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="gemini-panel__body">
          <p className="gemini-panel__intro">
            Optional — uses your saved cards and the upright/reversed choices you selected above.
          </p>

          {!apiKey.trim() && (
            <p className="gemini-panel__message gemini-panel__message--warn">
              Add your Gemini API key in{' '}
              <Link to="/settings" className="gemini-panel__link">
                Settings
              </Link>
              .
            </p>
          )}

          <label className="gemini-panel__field" htmlFor={`${idPrefix}-question`}>
            Your question
          </label>
          <textarea
            id={`${idPrefix}-question`}
            className="gemini-panel__question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="What would you like help understanding?"
            rows={3}
          />

          <CategoryButton
            title={loading ? 'Asking Gemini…' : 'Get Reading from Gemini'}
            onClick={askGemini}
            variant="readingAid"
            disabled={!canAsk}
          />

          {error && <p className="gemini-panel__message gemini-panel__message--error">{error}</p>}

          {reading && (
            <ReadingDisplay
              reading={reading}
              title="Gemini Reading"
              settingsLinkClassName="gemini-panel__link"
              noteClassName="gemini-panel__reading-note"
            />
          )}
        </div>
      )}
    </section>
  );
}
