import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUp, ArrowDown } from 'lucide-react';
import './Dashboard.css';

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
}

export default function SummaryCards() {
  const { transactions } = useApp();

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthTxns = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const lastMonthTxns = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    const monthIncome = currentMonthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const monthExpenses = currentMonthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const lastIncome = lastMonthTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const lastExpenses = lastMonthTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = monthIncome > 0 ? ((monthIncome - monthExpenses) / monthIncome * 100) : 0;

    const incomeChange = lastIncome > 0 ? ((monthIncome - lastIncome) / lastIncome * 100) : 0;
    const expenseChange = lastExpenses > 0 ? ((monthExpenses - lastExpenses) / lastExpenses * 100) : 0;

    return { balance, monthIncome, monthExpenses, savingsRate, incomeChange, expenseChange };
  }, [transactions]);

  const cards = [
    {
      key: 'balance',
      label: 'Total Balance',
      value: formatCurrency(stats.balance),
      icon: Wallet,
      trend: null,
    },
    {
      key: 'income',
      label: 'Monthly Income',
      value: formatCurrency(stats.monthIncome),
      icon: TrendingUp,
      trend: stats.incomeChange,
    },
    {
      key: 'expenses',
      label: 'Monthly Expenses',
      value: formatCurrency(stats.monthExpenses),
      icon: TrendingDown,
      trend: stats.expenseChange,
      invertTrend: true,
    },
    {
      key: 'savings',
      label: 'Savings Rate',
      value: `${stats.savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      trend: null,
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, i) => (
        <div
          key={card.key}
          className={`summary-card glass-card ${card.key}`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className="card-header">
            <span className="card-label">{card.label}</span>
            <div className={`card-icon ${card.key}`}>
              <card.icon size={20} />
            </div>
          </div>
          <div className="card-value">{card.value}</div>
          {card.trend !== null && (
            <span className={`card-trend ${(card.invertTrend ? -card.trend : card.trend) >= 0 ? 'up' : 'down'}`}>
              {card.trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {Math.abs(card.trend).toFixed(1)}% vs last month
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
