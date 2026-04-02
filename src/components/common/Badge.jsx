import { CATEGORIES } from '../../context/mockData';

export default function Badge({ category }) {
  const cat = CATEGORIES[category];
  const color = cat ? cat.color : 'var(--text-tertiary)';

  return (
    <span className="badge" style={{ background: `${color}18`, color }}>
      <span className="badge-dot" style={{ background: color }} />
      {category}
    </span>
  );
}
