import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

export default function MonthlyComparison() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    const monthMap = {};

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      if (!monthMap[key]) {
        monthMap[key] = { month: months[d.getMonth()], income: 0, expenses: 0 };
      }
      if (t.type === 'income') monthMap[key].income += t.amount;
      else monthMap[key].expenses += t.amount;
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--bg-modal)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontSize: '0.85rem', marginBottom: 2 }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="insights-chart-card glass-card">
      <h3>Monthly Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--chart-grid)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
          />
          <Bar
            dataKey="income"
            name="Income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationBegin={200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
