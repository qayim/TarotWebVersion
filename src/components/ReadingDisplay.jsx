import { Link } from 'react-router-dom';
import { parseReading } from '../utils/parseReading';
import './ReadingDisplay.css';

export default function ReadingDisplay({
  reading,
  title = 'Your Reading',
  settingsLinkClassName = '',
  noteClassName = '',
}) {
  const { overview, body } = parseReading(reading);

  return (
    <section className="reading-display">
      <h2 className="reading-display__title">{title}</h2>

      {overview && (
        <div className="reading-display__overview">
          <h3 className="reading-display__overview-title">Reading Overview</h3>
          <p className="reading-display__overview-body">{overview}</p>
        </div>
      )}

      <div className="reading-display__body">{overview ? body : reading}</div>

      <p className={`reading-display__note ${noteClassName}`.trim()}>
        Token usage and cost are tracked in{' '}
        <Link to="/settings" className={settingsLinkClassName || 'reading-display__link'}>
          Gemini Settings
        </Link>
        .
      </p>
    </section>
  );
}
