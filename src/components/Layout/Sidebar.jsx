import { useApp } from '../../context/AppContext';
import { LayoutDashboard, ArrowLeftRight, BarChart3, Wallet } from 'lucide-react';
import './Layout.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
];

export default function Sidebar({ isOpen, onClose }) {
  const { activeView, setView, role } = useApp();

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Wallet size={20} />
          </div>
          <h1>FinanceHub</h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => {
                setView(item.id);
                onClose();
              }}
            >
              <item.icon className="nav-icon" size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className={`role-badge ${role}`}>
            {role === 'admin' ? '🛡️' : '👁️'} {role}
          </span>
        </div>
      </aside>
    </>
  );
}
