require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
<<<<<<< HEAD
const path = require('path');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend
=======
const path = require('path'); // Add this for serving static files

const app = express();
app.use(express.json()); // Parse JSON bodies

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
>>>>>>> 57f6c22064a2fe9dfb604f5731b0ce89b94209c3

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
<<<<<<< HEAD
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve frontend
});

=======
>>>>>>> 57f6c22064a2fe9dfb604f5731b0ce89b94209c3
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
    res.status(400).json({ success: false, message війни

System: It looks like your message was cut off, and the `server.js` file in the artifact is incomplete (it ends abruptly at `message`). I’ll assume you want to continue with the deployment and frontend creation for the expense-splitting app, ensuring all backend functions (`GET /expenses`, `POST /expenses`, `PUT /expenses/:id`, `DELETE /expenses/:id`, `GET /people`, `GET /balances`, `GET /settlements`) are accessible via a simple frontend. Since you’ve been struggling with the `"Amount must be positive"` error and a 404 in the browser, I’ll also include fixes for those issues while providing a complete frontend solution.

I’ll:
1. Provide a complete, corrected `server.js` that serves the frontend and fixes the API issues.
2. Create a single `index.html` frontend using Tailwind CSS and JavaScript to interact with all backend endpoints.
3. Update the folder structure and guide you on integrating everything.
4. Explain how to test locally and redeploy to Render.com.
5. Address the `"Amount must be positive"` error by ensuring proper request handling.

### Step 1: Fix and Complete `server.js`
The `server.js` needs to:
- Serve static files (for the frontend).
- Include all required API routes.
- Ensure proper JSON parsing to fix the `"Amount must be positive"` error.

Here’s the complete `server.js`:

<xaiArtifact artifact_id="664c37de-6461-497a-91c7-d62123d1d0de" artifact_version_id="2bdc649e-2032-4b10-b193-354c2a4a3578" title="server.js" contentType="text/javascript">
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
  if (splitස

System: It looks like the `server.js` artifact was cut off again. I’ll provide a complete version of `server.js` and proceed with creating the frontend as requested, ensuring it supports all backend functions (`GET /expenses`, `POST /expenses`, `PUT /expenses/:id`, `DELETE /expenses/:id`, `GET /people`, `GET /balances`, `GET /settlements`). I’ll also address the `"Amount must be positive"` error, guide you through setting up the frontend, and explain how to deploy it on Render.com, keeping it beginner-friendly.

---

### Addressing the Issues
- **"Amount must be positive" Error**: This occurs in the `POST /expenses` endpoint if `amount` is missing, `undefined`, or `<= 0`. The debug log (`console.log('Request body:', req.body);`) and `express.json()` middleware are included to ensure proper JSON parsing. We’ll test this with the frontend to confirm it works.
- **404 in Browser**: The 404 error when visiting `http://localhost:3000/` is fixed by serving the frontend (`index.html`) from the `public` directory.

---

### Step 1: Complete and Verify `server.js`
Below is the full `server.js`, updated to:
- Serve the frontend from the `public` directory.
- Include all required API endpoints.
- Fix potential issues with request parsing.

<xaiArtifact artifact_id="664c37de-6461-497a-91c7-d62123d1d0de" artifact_version_id="a4a8032c-2967-4d5a-b5c1-2c56d47aedbc" title="server.js" contentType="text/javascript">
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
<<<<<<< HEAD
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> 57f6c22064a2fe9dfb604f5731b0ce89b94209c3
