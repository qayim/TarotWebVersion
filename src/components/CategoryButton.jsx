import './CategoryButton.css';

const VARIANTS = {
  default: 'category-button',
  fortune: 'category-button category-button--fortune',
  divination: 'category-button category-button--divination',
  readingAid: 'category-button category-button--reading-aid',
};

export default function CategoryButton({ title, onClick, variant = 'default', disabled = false }) {
  const className = VARIANTS[variant] ?? VARIANTS.default;

  return (
    <button className={className} onClick={onClick} type="button" disabled={disabled}>
      {title}
    </button>
  );
}
