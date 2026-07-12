import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cards } from '../data/cards';
import './CardSearch.css';

const MAX_RESULTS = 8;

function normalize(value) {
  return value.toLowerCase().trim();
}

function matchesQuery(card, query) {
  const name = normalize(card.cardName);
  const category = normalize(card.cardCategory);
  const type = normalize(card.cardType);

  if (name.includes(query) || category.includes(query) || type.includes(query)) {
    return true;
  }

  return card.uprightPoints.some((point) => normalize(point).includes(query));
}

export default function CardSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const trimmedQuery = normalize(query);

  const results = useMemo(() => {
    if (!trimmedQuery) return [];

    return cards.filter((card) => matchesQuery(card, trimmedQuery)).slice(0, MAX_RESULTS);
  }, [trimmedQuery]);

  function openCard(card) {
    const categoryCards = cards.filter((entry) => entry.cardCategory === card.cardCategory);

    navigate(`/cards/${encodeURIComponent(card.cardCategory)}`, {
      state: { cards: categoryCards, focusCardId: card.id },
    });
    setQuery('');
  }

  return (
    <div className="card-search">
      <label className="card-search__label" htmlFor="card-search-input">
        Search cards
      </label>
      <input
        id="card-search-input"
        className="card-search__input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name, suit, or keyword…"
        autoComplete="off"
        spellCheck={false}
      />

      {trimmedQuery && (
        <ul className="card-search__results" aria-live="polite">
          {results.length === 0 ? (
            <li className="card-search__empty">No cards found</li>
          ) : (
            results.map((card) => (
              <li key={card.id}>
                <button className="card-search__result" type="button" onClick={() => openCard(card)}>
                  <span className="card-search__name">{card.cardName}</span>
                  <span className="card-search__category">{card.cardCategory}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
