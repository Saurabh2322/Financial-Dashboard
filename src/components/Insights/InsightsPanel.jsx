import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import InsightCard from './InsightCard';
import MonthlyComparison from './MonthlyComparison';
import TopCategories from './TopCategories';
import { TrendingUp, DollarSign, BarChart3, Calendar } from 'lucide-react';

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function InsightsPanel() {
  const { transactions } = useApp();

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);

    // Highest spending category
    const catTotals = {};
    expenses.forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    // Average daily spend
    const dates = [...new Set(expenses.map((t) => t.date))];
    const avgDaily = dates.length > 0 ? totalExpenses / dates.length : 0;

    // Income to expense ratio
    const ratio = totalExpenses > 0 ? (totalIncome / totalExpenses).toFixed(2) : 'N/A';

    // Best saving month
    const monthData = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthData[key]) monthData[key] = { income: 0, expenses: 0, month: months[d.getMonth()] };
      if (t.type === 'income') monthData[key].income += t.amount;
      else monthData[key].expenses += t.amount;
    });

    const bestMonth = Object.values(monthData)
      .map((m) => ({ ...m, savings: m.income - m.expenses }))
      .sort((a, b) => b.savings - a.savings)[0];

    return {
      topCategory: topCat ? topCat[0] : 'N/A',
      topCategoryAmount: topCat ? topCat[1] : 0,
      avgDaily,
      ratio,
      bestMonth: bestMonth?.month || 'N/A',
      bestMonthSavings: bestMonth?.savings || 0,
    };
  }, [transactions]);

  return (
    <div className="insights-page">
      <div className="insights-cards">
        <InsightCard
          icon={BarChart3}
          iconBg="rgba(239,68,68,0.12)"
          iconColor="#ef4444"
          label="Highest Spend Category"
          value={insights.topCategory}
          description={`Total: ${formatCurrency(insights.topCategoryAmount)}`}
          delay={0}
        />
        <InsightCard
          icon={DollarSign}
          iconBg="rgba(245,158,11,0.12)"
          iconColor="#f59e0b"
          label="Avg Daily Spending"
          value={formatCurrency(insights.avgDaily)}
          description="Across all expense days"
          delay={0.08}
        />
        <InsightCard
          icon={TrendingUp}
          iconBg="rgba(16,185,129,0.12)"
          iconColor="#10b981"
          label="Income-to-Expense"
          value={`${insights.ratio}x`}
          description="Higher is better"
          delay={0.16}
        />
        <InsightCard
          icon={Calendar}
          iconBg="rgba(99,102,241,0.12)"
          iconColor="#6366f1"
          label="Best Saving Month"
          value={insights.bestMonth}
          description={`Saved ${formatCurrency(insights.bestMonthSavings)}`}
          delay={0.24}
        />
      </div>

      <div className="insights-charts-grid">
        <MonthlyComparison />
        <TopCategories />
      </div>
    </div>
  );
}
