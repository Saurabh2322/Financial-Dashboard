import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import FilterBar from './FilterBar';
import TransactionForm from './TransactionForm';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { Plus, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

const ITEMS_PER_PAGE = 15;

export default function TransactionList() {
  const {
    filteredTransactions, role, showForm, openForm, deleteTransaction, setFilter, filters
  } = useApp();

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTxns = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, page]);

  // Reset page when filters change
  useMemo(() => setPage(1), [filteredTransactions.length]);

  const handleSort = (column) => {
    if (filters.sortBy === column) {
      setFilter({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilter({ sortBy: column, sortDir: 'desc' });
    }
  };

  const getSortIcon = (column) => {
    if (filters.sortBy !== column) return <ArrowUpDown size={13} />;
    return filters.sortDir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  };

  const handleExport = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filteredTransactions.map((t) =>
      [t.date, `"${t.description}"`, t.category, t.type, t.amount].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <h2>{filteredTransactions.length} Transactions</h2>
          <button className="export-btn" onClick={handleExport} id="export-csv-btn">
            <Download size={16} /> Export CSV
          </button>
        </div>
        {role === 'admin' && (
          <button className="add-btn" onClick={() => openForm(null)} id="add-transaction-btn">
            <Plus size={18} /> Add Transaction
          </button>
        )}
      </div>

      <FilterBar />

      {showForm && <TransactionForm />}

      {filteredTransactions.length === 0 ? (
        <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
          <EmptyState
            title="No transactions found"
            message="Try adjusting your filters or add a new transaction."
          />
        </div>
      ) : (
        <div className="glass-card">
          <div className="transaction-table-wrapper">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th
                    className={filters.sortBy === 'date' ? 'sorted' : ''}
                    onClick={() => handleSort('date')}
                  >
                    Date <span className="sort-icon">{getSortIcon('date')}</span>
                  </th>
                  <th
                    className={filters.sortBy === 'description' ? 'sorted' : ''}
                    onClick={() => handleSort('description')}
                  >
                    Description <span className="sort-icon">{getSortIcon('description')}</span>
                  </th>
                  <th
                    className={filters.sortBy === 'category' ? 'sorted' : ''}
                    onClick={() => handleSort('category')}
                  >
                    Category <span className="sort-icon">{getSortIcon('category')}</span>
                  </th>
                  <th>Type</th>
                  <th
                    className={filters.sortBy === 'amount' ? 'sorted' : ''}
                    onClick={() => handleSort('amount')}
                  >
                    Amount <span className="sort-icon">{getSortIcon('amount')}</span>
                  </th>
                  {role === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedTxns.map((t) => (
                  <tr key={t.id}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {formatDate(t.date)}
                    </td>
                    <td className="tx-description">{t.description}</td>
                    <td><Badge category={t.category} /></td>
                    <td>
                      <span className={`badge ${t.type === 'income' ? '' : ''}`} style={{
                        background: t.type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)',
                        color: t.type === 'income' ? 'var(--success)' : 'var(--danger)',
                      }}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`tx-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                    </td>
                    {role === 'admin' && (
                      <td className="tx-actions">
                        <button
                          className="tx-action-btn"
                          onClick={() => openForm(t)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="tx-action-btn delete"
                          onClick={() => deleteTransaction(t.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={page === pageNum ? 'active' : ''}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
