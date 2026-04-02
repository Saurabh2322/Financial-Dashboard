import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../context/mockData';
import Badge from '../common/Badge';
import { ArrowRight } from 'lucide-react';

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RecentTransactions() {
  const { transactions, setView } = useApp();

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="recent-transactions glass-card">
      <div className="card-header-row">
        <h3>Recent Transactions</h3>
        <button
          className="view-all-btn"
          onClick={() => setView('transactions')}
          id="view-all-transactions-btn"
        >
          View All <ArrowRight size={14} />
        </button>
      </div>

      <ul className="recent-list">
        {recent.map((t) => {
          const cat = CATEGORIES[t.category];
          return (
            <li key={t.id} className="recent-item">
              <div className="recent-item-left">
                <div
                  className="recent-item-icon"
                  style={{
                    background: `${cat?.color || '#888'}15`,
                    color: cat?.color || '#888',
                  }}
                >
                  {t.type === 'income' ? '+' : '−'}
                </div>
                <div className="recent-item-info">
                  <h4>{t.description}</h4>
                  <span>{formatDate(t.date)} · <Badge category={t.category} /></span>
                </div>
              </div>
              <span className={`recent-item-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
