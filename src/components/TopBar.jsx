import { useNavigate } from 'react-router-dom';
import './TopBar.css';

export default function TopBar({ title, onClick, showBack = false, showSettings = false }) {
  const navigate = useNavigate();

  const titleElement = onClick ? (
    <button className="top-bar__title top-bar__title--clickable" onClick={onClick} type="button">
      {title}
    </button>
  ) : (
    <h1 className="top-bar__title">{title}</h1>
  );

  return (
    <header className="top-bar">
      {showBack && (
        <button
          className="top-bar__back"
          onClick={() => navigate('/')}
          type="button"
          aria-label="Back to menu"
        >
          <span className="material-symbols-outlined">arrow_back_2</span>
        </button>
      )}
      {titleElement}
      {showSettings && (
        <button
          className="top-bar__settings"
          onClick={() => navigate('/settings')}
          type="button"
          aria-label="Gemini settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      )}
    </header>
  );
}
