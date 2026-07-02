import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import './TarotCard.css';

function PointGrid({ points, variant }) {
  const row1 = points.slice(0, 3);
  const row2 = points.slice(3, 6);

  return (
    <div>
      <div className="point-rows">
        {row1.map((point) => (
          <span key={point} className={`point-chip point-chip--${variant}`}>
            {point}
          </span>
        ))}
      </div>
      <div className="point-rows">
        {row2.map((point) => (
          <span key={point} className={`point-chip point-chip--${variant}`}>
            {point}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TarotCard({
  id,
  cardName,
  type,
  category,
  position,
  uprightPoints,
  reversedPoints,
  upDesc,
  revDesc,
  allowPositionSelect = false,
}) {
  const { ids, getPosition, setPosition, addFavorite, removeFavorite } = useFavorites();
  const [showDesc, setShowDesc] = useState(false);
  const isFavorite = ids.includes(id);
  const selectedPosition = allowPositionSelect ? getPosition(id) : position;

  function toggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();
    if (isFavorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  }

  function selectPosition(event, nextPosition) {
    event.preventDefault();
    event.stopPropagation();
    setPosition(id, nextPosition);
  }

  function getContainerClass() {
    if (allowPositionSelect && selectedPosition === 'upright') {
      return 'tarot-card tarot-card--upright';
    }
    if (allowPositionSelect && selectedPosition === 'reversed') {
      return 'tarot-card tarot-card--reversed';
    }
    if (isFavorite && !allowPositionSelect) return 'tarot-card tarot-card--favorite';
    if (selectedPosition === 'upright') return 'tarot-card tarot-card--upright';
    if (selectedPosition === 'reversed') return 'tarot-card tarot-card--reversed';
    return 'tarot-card';
  }

  function renderBody() {
    if (showDesc) {
      if (selectedPosition === 'upright') {
        return (
          <div className="tarot-card__body">
            <p className="tarot-card__label tarot-card__label--upright">Up Right</p>
            <div className="tarot-card__desc tarot-card__desc--upright">{upDesc}</div>
          </div>
        );
      }

      if (selectedPosition === 'reversed') {
        return (
          <div className="tarot-card__body">
            <p className="tarot-card__label tarot-card__label--reversed">Reversed</p>
            <div className="tarot-card__desc tarot-card__desc--reversed">{revDesc}</div>
          </div>
        );
      }

      return (
        <div className="tarot-card__body tarot-card__body--desc">
          <section className="tarot-card__desc-section">
            <p className="tarot-card__label tarot-card__label--upright">Up Right</p>
            <div className="tarot-card__desc tarot-card__desc--upright">{upDesc}</div>
          </section>
          <section className="tarot-card__desc-section">
            <p className="tarot-card__label tarot-card__label--reversed">Reversed</p>
            <div className="tarot-card__desc tarot-card__desc--reversed">{revDesc}</div>
          </section>
        </div>
      );
    }

    if (selectedPosition === 'upright') {
      return (
        <div className="tarot-card__body">
          <p className="tarot-card__label tarot-card__label--upright">Up Right</p>
          <PointGrid points={uprightPoints} variant="upright" />
        </div>
      );
    }

    if (selectedPosition === 'reversed') {
      return (
        <div className="tarot-card__body">
          <p className="tarot-card__label tarot-card__label--reversed">Reversed</p>
          <PointGrid points={reversedPoints} variant="reversed" />
        </div>
      );
    }

    return (
      <div className="tarot-card__body">
        <p className="tarot-card__label tarot-card__label--upright">Up Right</p>
        <PointGrid points={uprightPoints} variant="upright" />
        <p className="tarot-card__label tarot-card__label--reversed">Reversed</p>
        <PointGrid points={reversedPoints} variant="reversed" />
      </div>
    );
  }

  return (
    <article
      className={getContainerClass()}
      onClick={() => setShowDesc((current) => !current)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setShowDesc((current) => !current);
        }
      }}
    >
      <div className="tarot-card__header">
        <div>
          <h2 className="tarot-card__name">{cardName}</h2>
          <p className="tarot-card__meta">{type}</p>
          <p className="tarot-card__meta tarot-card__meta--small">{category}</p>
        </div>
        <button
          className={`tarot-card__favorite ${isFavorite ? 'tarot-card__favorite--active' : ''}`}
          onClick={toggleFavorite}
          type="button"
          aria-label={isFavorite ? 'Remove from Reading Aid' : 'Add to Reading Aid'}
          title={isFavorite ? 'Remove from Reading Aid' : 'Add to Reading Aid'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      {allowPositionSelect && (
        <div className="tarot-card__position" role="group" aria-label="Card orientation">
          <button
            type="button"
            className={`tarot-card__position-btn ${
              selectedPosition === 'upright' ? 'tarot-card__position-btn--active-upright' : ''
            }`}
            onClick={(event) => selectPosition(event, 'upright')}
          >
            Upright
          </button>
          <button
            type="button"
            className={`tarot-card__position-btn ${
              selectedPosition === 'reversed' ? 'tarot-card__position-btn--active-reversed' : ''
            }`}
            onClick={(event) => selectPosition(event, 'reversed')}
          >
            Reversed
          </button>
        </div>
      )}

      {renderBody()}
    </article>
  );
}
