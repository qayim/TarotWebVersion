import { useState } from 'react';
import TopBar from '../components/TopBar';
import { getDailyDivination } from '../utils/dailyDivination';
import './DivinationScreen.css';

function getCategoryLabel(category) {
  if (category === 'Major') return 'Major Arcana';
  return `Suit of ${category}`;
}

const SOCIAL_LINKS = [
  {
    label: '333eonccc.com',
    href: 'https://333eonccc.com',
    description: 'Shop',
  },
  {
    label: '@333eonccc',
    href: 'https://www.instagram.com/333eonccc',
    description: 'Instagram',
  },
  {
    label: '@333eonccc',
    href: 'https://www.tiktok.com/@333eonccc',
    description: 'TikTok',
  },
];

export default function DivinationScreen() {
  const [{ card, quote }] = useState(getDailyDivination);

  return (
    <main className="screen">
      <div className="screen-content divination">
        <TopBar title="Divination of the Day" />

        <article className="divination__card">
          <p className="divination__eyebrow">{getCategoryLabel(card.cardCategory)}</p>
          <h2 className="divination__name">{card.cardName}</h2>
          <p className="divination__meta">{card.cardType}</p>
          <blockquote className="divination__quote">{quote}</blockquote>
        </article>

        <p className="divination__hint">Your card stays the same for 24 hours. Come back tomorrow for a new one.</p>

        <nav className="divination__links" aria-label="Social links">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.description}
              className="divination__link"
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="divination__link-label">{link.label}</span>
              <span className="divination__link-type">{link.description}</span>
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
