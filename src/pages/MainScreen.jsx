import { useNavigate } from 'react-router-dom';
import { cards } from '../data/cards';
import { useFavorites } from '../context/FavoritesContext';
import TopBar from '../components/TopBar';
import CategoryButton from '../components/CategoryButton';

const CATEGORIES = ['Cups', 'Wands', 'Swords', 'Pentacles', 'Major'];

export default function MainScreen() {
  const navigate = useNavigate();
  const { ids } = useFavorites();

  const favorites = ids
    .map((id) => cards.find((card) => card.id === id))
    .filter(Boolean);

  function openCategory(category, categoryCards) {
    navigate(`/cards/${encodeURIComponent(category)}`, {
      state: { cards: categoryCards },
    });
  }

  return (
    <main className="screen">
      <div className="screen-content">
        <TopBar title="Destiny's Cards" showSettings />
        <CategoryButton title="Fortune Telling" variant="fortune" onClick={() => navigate('/fortune')} />
        <CategoryButton
          title="Reading Aid"
          variant="readingAid"
          onClick={() => openCategory('Reading Aid', favorites)}
        />
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category}
            title={category}
            onClick={() =>
              openCategory(
                category,
                cards.filter((card) => card.cardCategory === category)
              )
            }
          />
        ))}
        <p className="hint">Tap ☆ on a card to save it to Reading Aid</p>
      </div>
    </main>
  );
}
