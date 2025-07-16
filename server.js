require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Expense Schema
const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  paid_by: { type: String, required: true },
  split_type: { type: String, enum: ['equal', 'percentage', 'exact'], required: true },
  participants: [{ type: String }],
  splits: [{ person: String, value: Number }],
  created_at: { type: Date, default: Date.now },
});
const Expense = mongoose.model('Expense', expenseSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve frontend
});

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/expenses', async (req, res) => {
  console.log('Request body:', req.body); // Debug
  const { amount, description, paid_by, split_type, participants, splits } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Amount must be positive' });
  if (!description) return res.status(400).json({ success: false, message: 'Description is required' });
  if (!paid_by) return res.status(400).json({ success: false, message: 'Paid by is required' });
  if (!['equal', 'percentage', 'exact'].includes(split_type)) return res.status(400).json({ success: false, message: 'Invalid split type' });

  if (split_type === 'equal' && (!participants || participants.length === 0)) {
    return res.status(400).json({ success: false, message: 'Participants required for equal split' });
  }
  if (split_type === 'percentage') {
    if (!splits || splits.length === 0) return res.status(400).json({ success: false, message: 'Splits required' });
    const total = splits.reduce((sum, s) => sum + s.value, 0);
    if (Math.abs(total - 100) > 0.01) return res.status(400).json({ success: false, message: 'Percentages must sum to 100' });
  }
  if (split_type === 'exact') {
    if (!splits || splits.length === 0) return res.status(400).json({ success: false, message: 'Splits required' });
    const total = splits.reduce((sum, s) => sum + s.value, 0);
    if (Math.abs(total - amount) > 0.01) return res.status(400).json({ success: false, message: 'Split amounts must sum to total' });
  }

  try {
    const expense = new Expense({ amount, description, paid_by, split_type, participants, splits });
    await expense.save();
    res.status(201).json({ success: true, data: expense, message: 'Expense added successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense, message: 'Expense updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/people', async (req, res) => {
  try {
    const expenses = await Expense.find();
    const people = new Set();
    expenses.forEach(exp => {
      people.add(exp.paid_by);
      if (exp.split_type === 'equal') exp.participants.forEach(p => people.add(p));
      else exp.splits.forEach(s => people.add(s.person));
    });
    res.json({ success: true, data: Array.from(people) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/balances', async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balances = {};
    expenses.forEach(exp => {
      balances[exp.paid_by] = (balances[exp.paid_by] || 0) + exp.amount;
      if (exp.split_type === 'equal') {
        const share = exp.amount / exp.participants.length;
        exp.participants.forEach(p => balances[p] = (balances[p] || 0) - share);
      } else if (exp.split_type === 'percentage') {
        exp.splits.forEach(s => balances[s.person] = (balances[s.person] || 0) - (s.value / 100) * exp.amount);
      } else {
        exp.splits.forEach(s => balances[s.person] = (balances[s.person] || 0) - s.value);
      }
    });
    res.json({ success: true, data: balances });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/settlements', async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balances = {};
    expenses.forEach(exp => {
      balances[exp.paid_by] = (balances[exp.paid_by] || 0) + exp.amount;
      if (exp.split_type === 'equal') {
        const share = exp.amount / exp.participants.length;
        exp.participants.forEach(p => balances[p] = (balances[p] || 0) - share);
      } else if (exp.split_type === 'percentage') {
        exp.splits.forEach(s => balances[s.person] = (balances[s.person] || 0) - (s.value / 100) * exp.amount);
      } else {
        exp.splits.forEach(s => balances[s.person] = (balances[s.person] || 0) - s.value);
      }
    });
    const settlements = [];
    Object.keys(balances).forEach(person => {
      if (balances[person] < 0) {
        const debt = -balances[person];
        Object.keys(balances).forEach(other => {
          if (balances[other] > 0) {
            const amount = Math.min(debt, balances[other]);
            if (amount > 0.01) {
              settlements.push({ from: person, to: other, amount });
              balances[person] += amount;
              balances[other] -= amount;
            }
          }
        });
      }
    });
    res.json({ success: true, data: settlements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));