import { useApp } from '../../context/AppContext';
import { Search, X } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../context/mockData';
import './Transactions.css';

const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export default function FilterBar() {
  const { filters, setFilter, clearFilters } = useApp();

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.dateFrom || filters.dateTo;

  return (
    <div className="filter-bar glass-card">
      <div className="search-input">
        <Search className="search-icon" size={16} />
        <input
          id="search-input"
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilter({ search: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select
          id="category-filter"
          value={filters.category}
          onChange={(e) => setFilter({ category: e.target.value })}
        >
          <option value="all">All Categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Type</label>
        <select
          id="type-filter"
          value={filters.type}
          onChange={(e) => setFilter({ type: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="filter-group">
        <label>From</label>
        <input
          id="date-from-filter"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilter({ dateFrom: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>To</label>
        <input
          id="date-to-filter"
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilter({ dateTo: e.target.value })}
        />
      </div>

      {hasActiveFilters && (
        <button className="clear-filters-btn" onClick={clearFilters} id="clear-filters-btn">
          <X size={14} /> Clear
        </button>
      )}
    </div>
  );
}
