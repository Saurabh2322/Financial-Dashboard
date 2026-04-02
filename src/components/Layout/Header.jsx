import { useApp } from '../../context/AppContext';
import { Sun, Moon, Menu } from 'lucide-react';

const viewTitles = {
  dashboard: 'Dashboard Overview',
  transactions: 'Transactions',
  insights: 'Insights & Analytics',
};

export default function Header({ onMenuClick }) {
  const { activeView, role, setRole, theme, toggleTheme } = useApp();

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} id="mobile-menu-btn">
          <Menu size={20} />
        </button>
        <h2>{viewTitles[activeView] || 'Dashboard'}</h2>
      </div>

      <div className="header-right">
        <div className="role-switcher">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '0 0.5rem', fontWeight: 500 }}>
            Role:
          </span>
          <button
            id="role-viewer-btn"
            className={role === 'viewer' ? 'active' : ''}
            onClick={() => setRole('viewer')}
          >
            Viewer
          </button>
          <button
            id="role-admin-btn"
            className={role === 'admin' ? 'active' : ''}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          id="theme-toggle-btn"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
