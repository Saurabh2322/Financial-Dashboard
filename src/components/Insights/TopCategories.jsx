import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../context/mockData';

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

export default function TopCategories() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    const catTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
      });

    const sorted = Object.entries(catTotals)
      .map(([name, total]) => ({
        name,
        total,
        color: CATEGORIES[name]?.color || '#888',
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    const max = sorted[0]?.total || 1;
    return sorted.map((d) => ({ ...d, pct: (d.total / max) * 100 }));
  }, [transactions]);

  return (
    <div className="insights-chart-card glass-card">
      <h3>Top Spending Categories</h3>
      <div className="top-categories-list">
        {data.map((d, i) => (
          <div key={d.name} className="top-category-item">
            <span className="top-category-rank">{i + 1}</span>
            <div className="top-category-info">
              <div className="top-category-header">
                <span className="top-category-name" style={{ color: d.color }}>{d.name}</span>
                <span className="top-category-amount">{formatCurrency(d.total)}</span>
              </div>
              <div className="top-category-bar">
                <div
                  className="top-category-bar-fill"
                  style={{ width: `${d.pct}%`, background: d.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
