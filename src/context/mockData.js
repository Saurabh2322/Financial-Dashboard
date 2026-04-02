// Categories with their colors and icons
export const CATEGORIES = {
  'Food & Dining': { color: '#f97316', icon: 'UtensilsCrossed' },
  'Shopping': { color: '#ec4899', icon: 'ShoppingBag' },
  'Transportation': { color: '#8b5cf6', icon: 'Car' },
  'Bills & Utilities': { color: '#06b6d4', icon: 'Zap' },
  'Entertainment': { color: '#f43f5e', icon: 'Gamepad2' },
  'Healthcare': { color: '#10b981', icon: 'Heart' },
  'Salary': { color: '#22c55e', icon: 'Briefcase' },
  'Freelance': { color: '#14b8a6', icon: 'Laptop' },
  'Investments': { color: '#6366f1', icon: 'TrendingUp' },
  'Education': { color: '#a855f7', icon: 'GraduationCap' },
  'Travel': { color: '#0ea5e9', icon: 'Plane' },
  'Subscriptions': { color: '#e11d48', icon: 'CreditCard' },
};

export const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Shopping', 'Transportation', 'Bills & Utilities',
  'Entertainment', 'Healthcare', 'Education', 'Travel', 'Subscriptions'
];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments'];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Generate 6 months of realistic transaction data
function generateTransactions() {
  const transactions = [];
  const now = new Date(2026, 3, 1); // April 2026

  const expenseTemplates = [
    { desc: 'Grocery Store', cat: 'Food & Dining', min: 25, max: 120 },
    { desc: 'Restaurant Dinner', cat: 'Food & Dining', min: 30, max: 85 },
    { desc: 'Coffee Shop', cat: 'Food & Dining', min: 4, max: 12 },
    { desc: 'Food Delivery', cat: 'Food & Dining', min: 15, max: 45 },
    { desc: 'Amazon Purchase', cat: 'Shopping', min: 15, max: 200 },
    { desc: 'Clothing Store', cat: 'Shopping', min: 30, max: 150 },
    { desc: 'Electronics', cat: 'Shopping', min: 50, max: 400 },
    { desc: 'Home Decor', cat: 'Shopping', min: 20, max: 100 },
    { desc: 'Gas Station', cat: 'Transportation', min: 30, max: 65 },
    { desc: 'Uber Ride', cat: 'Transportation', min: 8, max: 35 },
    { desc: 'Car Insurance', cat: 'Transportation', min: 120, max: 180 },
    { desc: 'Parking', cat: 'Transportation', min: 5, max: 20 },
    { desc: 'Electric Bill', cat: 'Bills & Utilities', min: 80, max: 160 },
    { desc: 'Water Bill', cat: 'Bills & Utilities', min: 30, max: 60 },
    { desc: 'Internet Service', cat: 'Bills & Utilities', min: 60, max: 90 },
    { desc: 'Phone Bill', cat: 'Bills & Utilities', min: 40, max: 80 },
    { desc: 'Movie Theater', cat: 'Entertainment', min: 12, max: 30 },
    { desc: 'Concert Tickets', cat: 'Entertainment', min: 50, max: 200 },
    { desc: 'Streaming Service', cat: 'Subscriptions', min: 10, max: 20 },
    { desc: 'Gaming Subscription', cat: 'Subscriptions', min: 10, max: 15 },
    { desc: 'Cloud Storage', cat: 'Subscriptions', min: 3, max: 15 },
    { desc: 'Doctor Visit', cat: 'Healthcare', min: 50, max: 200 },
    { desc: 'Pharmacy', cat: 'Healthcare', min: 10, max: 60 },
    { desc: 'Gym Membership', cat: 'Healthcare', min: 30, max: 50 },
    { desc: 'Online Course', cat: 'Education', min: 20, max: 100 },
    { desc: 'Books', cat: 'Education', min: 10, max: 40 },
    { desc: 'Weekend Trip', cat: 'Travel', min: 100, max: 500 },
    { desc: 'Hotel Stay', cat: 'Travel', min: 80, max: 300 },
    { desc: 'Flight Tickets', cat: 'Travel', min: 200, max: 600 },
  ];

  const incomeTemplates = [
    { desc: 'Monthly Salary', cat: 'Salary', min: 5200, max: 5200 },
    { desc: 'Freelance Project', cat: 'Freelance', min: 500, max: 2500 },
    { desc: 'Stock Dividends', cat: 'Investments', min: 100, max: 400 },
    { desc: 'Side Project Income', cat: 'Freelance', min: 200, max: 800 },
    { desc: 'Investment Returns', cat: 'Investments', min: 150, max: 600 },
  ];

  // Generate for each of the last 6 months
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const year = now.getFullYear();
    const month = now.getMonth() - monthOffset;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Salary — 1st of each month
    transactions.push({
      id: generateId(),
      date: new Date(year, month, 1).toISOString().split('T')[0],
      description: 'Monthly Salary',
      amount: 5200,
      type: 'income',
      category: 'Salary',
    });

    // 1-2 freelance per month
    const freelanceCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < freelanceCount; i++) {
      const template = incomeTemplates[Math.floor(Math.random() * (incomeTemplates.length - 1)) + 1];
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      transactions.push({
        id: generateId(),
        date: new Date(year, month, day).toISOString().split('T')[0],
        description: template.desc,
        amount: Math.round(Math.random() * (template.max - template.min) + template.min),
        type: 'income',
        category: template.cat,
      });
    }

    // 12-18 expenses per month
    const expenseCount = Math.floor(Math.random() * 7) + 12;
    for (let i = 0; i < expenseCount; i++) {
      const template = expenseTemplates[Math.floor(Math.random() * expenseTemplates.length)];
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      transactions.push({
        id: generateId(),
        date: new Date(year, month, day).toISOString().split('T')[0],
        description: template.desc,
        amount: Math.round(Math.random() * (template.max - template.min) + template.min),
        type: 'expense',
        category: template.cat,
      });
    }
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  return transactions;
}

export const defaultTransactions = generateTransactions();
