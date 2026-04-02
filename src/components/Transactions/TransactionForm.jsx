import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../context/mockData';
import Modal from '../common/Modal';

export default function TransactionForm() {
  const { editingTransaction, addTransaction, updateTransaction, hideForm } = useApp();

  const isEdit = !!editingTransaction;

  const [form, setForm] = useState({
    description: editingTransaction?.description || '',
    amount: editingTransaction?.amount || '',
    type: editingTransaction?.type || 'expense',
    category: editingTransaction?.category || 'Food & Dining',
    date: editingTransaction?.date || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Reset category when type changes
  const handleTypeChange = (type) => {
    const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setForm((f) => ({
      ...f,
      type,
      category: cats.includes(f.category) ? f.category : cats[0],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const txn = {
      ...form,
      amount: Number(form.amount),
    };

    if (isEdit) {
      updateTransaction({ ...txn, id: editingTransaction.id });
    } else {
      addTransaction(txn);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Transaction' : 'Add Transaction'} onClose={hideForm}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tx-description">Description</label>
          <input
            id="tx-description"
            type="text"
            placeholder="e.g. Grocery Store"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            style={errors.description ? { borderColor: 'var(--danger)' } : {}}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tx-amount">Amount (₹)</label>
            <input
              id="tx-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              style={errors.amount ? { borderColor: 'var(--danger)' } : {}}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tx-date">Date</label>
            <input
              id="tx-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              style={errors.date ? { borderColor: 'var(--danger)' } : {}}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tx-type">Type</label>
            <select
              id="tx-type"
              value={form.type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tx-category">Category</label>
            <select
              id="tx-category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={hideForm}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" id="tx-submit-btn">
            {isEdit ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </form>
    </Modal>
  );
}
