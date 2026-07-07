import { cards } from '../data/cards';
import { dailyQuotes } from '../data/dailyDivinations';

export function drawDailyDivination() {
  const card = cards[Math.floor(Math.random() * cards.length)];

  return {
    card,
    quote: dailyQuotes[card.cardName] ?? 'Trust the journey today.',
  };
}
