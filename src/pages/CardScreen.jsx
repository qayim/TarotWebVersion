import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cards as allCards } from '../data/cards';
import { useFavorites } from '../context/FavoritesContext';
import TopBar from '../components/TopBar';
import TarotCard from '../components/TarotCard';
import GeminiReadingPanel from '../components/GeminiReadingPanel';

export default function CardScreen() {
  const { category } = useParams();
  const location = useLocation();
  const { positions } = useFavorites();
  const cards = location.state?.cards ?? allCards;
  const categoryName = decodeURIComponent(category);
  const isReadingAid = categoryName === 'Reading Aid';

  const spread = useMemo(
    () => cards.map((card) => ({ card, position: positions[card.id] ?? 'upright' })),
    [cards, positions]
  );

  return (
    <main className="screen">
      <div className="screen-content">
        <TopBar title={categoryName} showBack />
        <div className="card-list">
          {cards.length === 0 ? (
            <p className="hint">
              No cards here yet. Star some cards from any suit to build your Reading Aid.
            </p>
          ) : (
            cards.map((card) => (
              <TarotCard
                key={card.id}
                id={card.id}
                cardName={card.cardName}
                type={card.cardType}
                category={card.cardCategory}
                uprightPoints={card.uprightPoints}
                reversedPoints={card.reversedPoints}
                upDesc={card.upDesc}
                revDesc={card.revDesc}
                allowPositionSelect={isReadingAid}
              />
            ))
          )}
        </div>

        {isReadingAid && cards.length > 0 && (
          <GeminiReadingPanel spread={spread} idPrefix="reading-aid" />
        )}

        <p className="hint">
          {isReadingAid
            ? 'Choose upright or reversed · Tap a card for full meaning'
            : 'Tap a card for full meaning · Tap ☆ to favorite'}
        </p>
      </div>
    </main>
  );
}
