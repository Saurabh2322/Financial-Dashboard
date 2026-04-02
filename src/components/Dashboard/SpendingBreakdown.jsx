import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../context/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

export default function SpendingBreakdown() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    const catTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(catTotals)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORIES[name]?.color || '#888',
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    const pct = ((item.value / total) * 100).toFixed(1);
    return (
      <div style={{
        background: 'var(--bg-modal)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: item.payload.color }}>
          {item.name}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {formatCurrency(item.value)} ({pct}%)
        </p>
      </div>
    );
  };

  return (
    <div className="chart-card glass-card">
      <h3>Spending Breakdown</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1000}
            animationBegin={200}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 16px',
        justifyContent: 'center',
        marginTop: '8px',
      }}>
        {data.slice(0, 6).map((d) => (
          <span key={d.name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: d.color,
              flexShrink: 0,
            }} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}
