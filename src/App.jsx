import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import SummaryCards from './components/Dashboard/SummaryCards';
import BalanceTrend from './components/Dashboard/BalanceTrend';
import SpendingBreakdown from './components/Dashboard/SpendingBreakdown';
import RecentTransactions from './components/Dashboard/RecentTransactions';
import TransactionList from './components/Transactions/TransactionList';
import InsightsPanel from './components/Insights/InsightsPanel';
import './components/Layout/Layout.css';
import './components/Dashboard/Dashboard.css';
import './components/Transactions/Transactions.css';
import './components/Insights/Insights.css';
import './components/common/Common.css';

function DashboardView() {
  return (
    <div className="dashboard-page">
      <SummaryCards />
      <div className="charts-grid">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>
      <RecentTransactions />
    </div>
  );
}

function AppContent() {
  const { activeView } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="page-content">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'transactions' && <TransactionList />}
          {activeView === 'insights' && <InsightsPanel />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
