import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BalanceTrend() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    // Group transactions by month and compute running balance
    const monthMap = {};
    
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      if (!monthMap[key]) {
        monthMap[key] = { income: 0, expenses: 0, month: months[d.getMonth()] };
      }
      if (t.type === 'income') monthMap[key].income += t.amount;
      else monthMap[key].expenses += t.amount;
    });

    const sorted = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b));

    let balance = 0;
    return sorted.map(([, v]) => {
      balance += v.income - v.expenses;
      return { month: v.month, balance, income: v.income, expenses: v.expenses };
    });
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
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#818cf8', fontSize: '0.85rem' }}>
          Balance: {formatCurrency(payload[0]?.value)}
        </p>
      </div>
    );
  };

  return (
    <div className="chart-card glass-card">
      <h3>Balance Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#balanceGradient)"
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
