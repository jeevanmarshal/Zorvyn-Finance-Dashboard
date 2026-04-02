# Finance Dashboard

A personal finance tracker I built as part of a frontend screening assignment for Zorvyn FinTech. The goal was to build a clean UI for tracking transactions and understanding spending patterns.

## What I built

The app has three main sections: a Dashboard with summary cards and charts, a Transactions page where you can search/filter/sort your spending, and an Insights page that pulls out patterns from the data. I also added a role switcher so you can toggle between Viewer mode (read-only) and Admin mode (which lets you add, edit, and delete transactions).

The data is all static — 28 mock transactions across January to March 2026, using realistic Indian apps and merchants like Zomato, D-Mart, PhonePe, and Ola.

## Tech choices

- **React + Vite** — familiar setup, fast dev server, no unnecessary boilerplate
- **Plain CSS** — wanted full control over the look. Writing CSS myself made it easier to get the spacing and colours exactly how I wanted them
- **Recharts** — tried building the charts from scratch first but it wasn't worth the time. Recharts gave me clean bar and pie charts with a simple API
- **Context API** — kept all the shared state (transactions, role, filters, dark mode) in one context. For an app this size, Redux felt like overkill
- **No backend** — the task said static data was fine so I kept it simple

## Features

- Dashboard: total balance, income, expenses, savings rate cards + monthly bar chart + spending donut chart
- Transactions: search by name or amount, filter by type and category, sort by date or amount, export to CSV
- Role-based UI: Viewer sees read-only data, Admin sees edit/delete buttons and an "Add Transaction" modal
- Insights: top spending category, month-over-month comparison, weekend vs weekday spending pattern, freelance income breakdown
- Dark mode toggle (top right corner)
- Responsive — works on mobile with a bottom tab bar

## How to run

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## What I'd improve with more time

- Add actual data persistence (localStorage or a lightweight backend)
- Make the charts interactive — clicking a category on the donut could filter the transactions list
- Add a date range picker to filter by time period
- Write some basic tests for the helper functions
- The mobile layout for the filters bar could be cleaner
