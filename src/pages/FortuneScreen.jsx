import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cards } from '../data/cards';
import { useGeminiSettings } from '../context/GeminiSettingsContext';
import { generateTarotReading } from '../services/gemini';
import TopBar from '../components/TopBar';
import CategoryButton from '../components/CategoryButton';
import TarotCard from '../components/TarotCard';
import ReadingDisplay from '../components/ReadingDisplay';
import './FortuneScreen.css';

function drawUniqueCards(count) {
  const drawn = new Map();

  while (drawn.size < count) {
    const id = Math.floor(Math.random() * 78) + 1;
    if (drawn.has(id)) continue;

    drawn.set(id, {
      card: cards.find((entry) => entry.id === id),
      position: Math.random() < 0.5 ? 'upright' : 'reversed',
    });
  }

  return Array.from(drawn.values());
}

export default function FortuneScreen() {
  const { apiKey, model, recordUsage } = useGeminiSettings();
  const [spread, setSpread] = useState([]);
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasSpread = spread.length > 0;
  const canAskGemini =
    hasSpread && question.trim().length > 0 && apiKey.trim().length > 0 && !loading;

  function startReading() {
    setError('');
    setReading('');
    setQuestion('');
    setSpread(drawUniqueCards(6));
  }

  async function askGemini() {
    setError('');
    setLoading(true);

    try {
      const result = await generateTarotReading({
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
    <main className="screen">
      <div className="screen-content fortune">
        <TopBar title="Fortune Telling" showBack />

        <CategoryButton title="Start" onClick={startReading} />

        {!apiKey.trim() && (
          <p className="fortune__message fortune__message--warn">
            Add your Gemini API key in{' '}
            <Link to="/settings" className="fortune__link">
              Settings
            </Link>{' '}
            before requesting a reading.
          </p>
        )}

        {hasSpread && (
          <>
            <div className="card-list">
              {spread.map(({ card, position }) => (
                <TarotCard
                  key={`${card.id}-${position}`}
                  id={card.id}
                  cardName={card.cardName}
                  type={card.cardType}
                  category={card.cardCategory}
                  position={position}
                  uprightPoints={card.uprightPoints}
                  reversedPoints={card.reversedPoints}
                  upDesc={card.upDesc}
                  revDesc={card.revDesc}
                />
              ))}
            </div>

            <p className="hint">Six cards drawn · gold = upright · silver = reversed</p>

            <section className="fortune__panel">
              <label className="fortune__field" htmlFor="fortune-question">
                Your question
              </label>
              <textarea
                id="fortune-question"
                className="fortune__question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What would you like the cards to answer?"
                rows={4}
              />
            </section>

            <CategoryButton
              title={loading ? 'Asking Gemini…' : 'Get Reading from Gemini'}
              onClick={askGemini}
              variant="readingAid"
              disabled={!canAskGemini}
            />

            {!question.trim() && (
              <p className="hint">Type your question above, then ask Gemini for your reading.</p>
            )}
          </>
        )}

        {error && <p className="fortune__message fortune__message--error">{error}</p>}

        {reading && (
          <ReadingDisplay
            reading={reading}
            settingsLinkClassName="fortune__link"
            noteClassName="fortune__reading-note"
          />
        )}

        <Link to="/settings" className="fortune__settings-link">
          Gemini Settings & token usage
        </Link>
      </div>
    </main>
  );
}
