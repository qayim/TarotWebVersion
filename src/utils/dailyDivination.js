import { cards } from '../data/cards';
import { dailyQuotes } from '../data/dailyDivinations';

const STORAGE_KEY = 'tarot-daily-divination';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function getQuote(card) {
  return dailyQuotes[card.cardName] ?? 'Trust the journey today.';
}

function drawDailyDivination() {
  const card = cards[Math.floor(Math.random() * cards.length)];

  return {
    card,
    quote: getQuote(card),
  };
}

function loadStoredDivination() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!parsed?.cardId || !parsed?.drawnAt) return null;

    const age = Date.now() - new Date(parsed.drawnAt).getTime();
    if (age >= TWENTY_FOUR_HOURS_MS) return null;

    const card = cards.find((entry) => entry.id === parsed.cardId);
    if (!card) return null;

    return {
      card,
      quote: parsed.quote ?? getQuote(card),
    };
  } catch {
    return null;
  }
}

function saveDivination({ card, quote }) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      cardId: card.id,
      quote,
      drawnAt: new Date().toISOString(),
    })
  );
}

export function getDailyDivination() {
  const stored = loadStoredDivination();
  if (stored) return stored;

  const drawn = drawDailyDivination();
  saveDivination(drawn);
  return drawn;
}
