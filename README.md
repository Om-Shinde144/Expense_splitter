# Expense Splitter Backend

A simple Node.js backend for splitting expenses among groups.

## Setup Locally
1. Clone: `git clone <your-repo-url>`
2. Install: `npm install`
3. Set `.env`: `MONGODB_URI=<your-mongodb-atlas-uri>`
4. Run: `node server.js`

## Deployed URL
- [https://expense-splitter.onrender.com](https://expense-splitter.onrender.com)

## Postman Collection
- Gist: `<your-gist-url>`

## Endpoints
- GET /expenses: List all expenses
- POST /expenses: Add expense
- PUT /expenses/:id: Update expense
- DELETE /expenses/:id: Delete expense
- GET /people: List all people
- GET /balances: Show balances
- GET /settlements: Show settlements
