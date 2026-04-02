import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { defaultTransactions } from './mockData';

const AppContext = createContext(null);

// Load from localStorage
function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

const initialState = {
  transactions: loadState('fd_transactions', defaultTransactions),
  role: loadState('fd_role', 'admin'),
  theme: loadState('fd_theme', 'dark'),
  activeView: 'dashboard',
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortDir: 'desc',
  },
  editingTransaction: null,
  showForm: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          search: '',
          category: 'all',
          type: 'all',
          dateFrom: '',
          dateTo: '',
          sortBy: 'date',
          sortDir: 'desc',
        },
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        showForm: false,
        editingTransaction: null,
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        showForm: false,
        editingTransaction: null,
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case 'SHOW_FORM':
      return { ...state, showForm: true, editingTransaction: action.payload || null };

    case 'HIDE_FORM':
      return { ...state, showForm: false, editingTransaction: null };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('fd_transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('fd_role', JSON.stringify(state.role));
  }, [state.role]);

  useEffect(() => {
    localStorage.setItem('fd_theme', JSON.stringify(state.theme));
  }, [state.theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Memoized actions
  const actions = useMemo(() => ({
    setView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),
    setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
    toggleTheme: () =>
      dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' }),
    setFilter: (filter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    clearFilters: () => dispatch({ type: 'CLEAR_FILTERS' }),
    addTransaction: (t) =>
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: { ...t, id: Math.random().toString(36).substr(2, 9) },
      }),
    updateTransaction: (t) => dispatch({ type: 'UPDATE_TRANSACTION', payload: t }),
    deleteTransaction: (id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id }),
    openForm: (t) => dispatch({ type: 'SHOW_FORM', payload: t }),
    hideForm: () => dispatch({ type: 'HIDE_FORM' }),
  }), [state.theme]);

  // Computed values
  const filteredTransactions = useMemo(() => {
    let result = [...state.transactions];
    const { search, category, type, dateFrom, dateTo, sortBy, sortDir } = state.filters;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (category !== 'all') {
      result = result.filter((t) => t.category === category);
    }

    if (type !== 'all') {
      result = result.filter((t) => t.type === type);
    }

    if (dateFrom) {
      result = result.filter((t) => t.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((t) => t.date <= dateTo);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = new Date(a.date) - new Date(b.date);
      else if (sortBy === 'amount') cmp = a.amount - b.amount;
      else if (sortBy === 'description') cmp = a.description.localeCompare(b.description);
      else if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [state.transactions, state.filters]);

  const value = useMemo(
    () => ({ ...state, filteredTransactions, ...actions }),
    [state, filteredTransactions, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
