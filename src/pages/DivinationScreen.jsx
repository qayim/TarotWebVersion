import { useState } from 'react';
import TopBar from '../components/TopBar';
import { drawDailyDivination } from '../utils/dailyDivination';
import './DivinationScreen.css';

function getCategoryLabel(category) {
  if (category === 'Major') return 'Major Arcana';
  return `Suit of ${category}`;
}

export default function DivinationScreen() {
  const [{ card, quote }] = useState(drawDailyDivination);

  return (
    <main className="screen">
      <div className="screen-content divination">
        <TopBar title="Divination of the Day" showBack />

        <article className="divination__card">
          <p className="divination__eyebrow">{getCategoryLabel(card.cardCategory)}</p>
          <h2 className="divination__name">{card.cardName}</h2>
          <p className="divination__meta">{card.cardType}</p>
          <blockquote className="divination__quote">{quote}</blockquote>
        </article>

        <p className="divination__hint">Open this page again anytime for a new card.</p>
      </div>
    </main>
  );
}
