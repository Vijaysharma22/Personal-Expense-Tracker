// Data storage
const expenses = [];

// Categories configuration
const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Education', 'Other'];

const categoryEmojis = {
    'Food':'',
    'Transport':'',
    'Entertainment':'',
    'Shopping':'',
    'Utilities':'',
    'Health':'',
    'Education':'',
    'Other':'',
};   

// Initialize the app
function init() {
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();

    // Add event listeners
    document.getElementById('expenseForm').addEventListener('submit', addExpense);
    document.getElementById('clearBtn').addEventListener('click', clearAllExpenses);

    // Initial UI update
    updateUI();
}

// Add new expense
function addExpense(e) {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // Validation
    if (!description || !amount || !category || !date) {
        alert('Please fill in all fields');
        return;
    }

    if (amount <= 0) {
        alert('Amount must be greater than 0');
        return;
    }

    // Add expense to array
    expenses.push({
        id: Date.now(),
        description,
        amount,
        category,
        date,
        emoji: categoryEmojis[category]
    });

    // Reset form and UI
    document.getElementById('expenseForm').reset();
    document.getElementById('date').valueAsDate = new Date();
    updateUI();
}

// Clear all expenses
function clearAllExpenses() {
    if (expenses.length === 0) {
        alert('No expenses to clear');
        return;
    }

    if (confirm('Are you sure you want to delete all expenses? This action cannot be undone.')) {
        expenses.length = 0;
        updateUI();
    }
}

// Delete single expense
function deleteExpense(id) {
    const index = expenses.findIndex(e => e.id === id);
    if (index > -1) {
        expenses.splice(index, 1);
        updateUI();
    }
}

// Main UI update function
function updateUI() {
    updateSummary();
    updateCategoryBreakdown();
    updateExpensesList();
}

// Update summary section
function updateSummary() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    const avg = count > 0 ? total / count : 0;

    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('expenseCount').textContent = count;
    document.getElementById('avgAmount').textContent = `₹${avg.toFixed(2)}`;
}

// Update category breakdown
function updateCategoryBreakdown() {
    const breakdown = {};
    
    // Initialize all categories with 0
    categories.forEach(cat => {
        breakdown[cat] = 0;
    });

    // Calculate totals for each category
    expenses.forEach(e => {
        breakdown[e.category] += e.amount;
    });

    const breakdownDiv = document.getElementById('categoryBreakdown');

    // Show empty message if no expenses
    if (expenses.length === 0) {
        breakdownDiv.innerHTML = '<div class="empty-message">No expenses yet. Add one to get started!</div>';
        return;
    }

    // Clear previous content
    breakdownDiv.innerHTML = '';

    // Create cards for categories with expenses
    categories.forEach(cat => {
        if (breakdown[cat] > 0) {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-name">${categoryEmojis[cat]} ${cat}</div>
                <div class="category-amount">₹${breakdown[cat].toFixed(2)}</div>
            `;
            breakdownDiv.appendChild(card);
        }
    });
}

// Update expenses list
function updateExpensesList() {
    const listDiv = document.getElementById('expensesList');

    // Show empty message if no expenses
    if (expenses.length === 0) {
        listDiv.innerHTML = '<div class="empty-message">No expenses recorded yet</div>';
        return;
    }

    // Sort expenses by date (newest first)
    const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Clear previous content
    listDiv.innerHTML = '';

    // Create expense items
    sorted.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'expense-item';

        // Format date
        const date = new Date(expense.date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        item.innerHTML = `
            <div class="expense-info">
                <div class="expense-description">${expense.emoji} ${expense.description}</div>
                <div class="expense-category">${expense.category} • ${date}</div>
            </div>
            <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
        `;

        listDiv.appendChild(item);
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);