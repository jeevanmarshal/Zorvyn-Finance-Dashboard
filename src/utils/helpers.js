// helper functions i keep reusing across components
// nothing fancy, just keeping things in one place

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// returns total income from a list of transactions
export function getTotalIncome(transactions) {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
}

// returns total expenses
export function getTotalExpenses(transactions) {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)
}

// groups transactions by month for the chart
// returns something like [{ month: "Jan", income: 50000, expense: 12000 }, ...]
export function groupByMonth(transactions) {
  const monthMap = {}

  transactions.forEach((t) => {
    const date = new Date(t.date)
    const key = date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" })

    if (!monthMap[key]) {
      monthMap[key] = { month: key, income: 0, expense: 0 }
    }

    if (t.type === "income") {
      monthMap[key].income += t.amount
    } else {
      monthMap[key].expense += t.amount
    }
  })

  return Object.values(monthMap)
}

// groups expenses by category for the donut chart
export function groupByCategory(transactions) {
  const catMap = {}

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!catMap[t.category]) {
        catMap[t.category] = 0
      }
      catMap[t.category] += t.amount
    })

  // converting to the format recharts needs
  return Object.entries(catMap).map(([name, value]) => ({ name, value }))
}

// savings rate = (income - expenses) / income * 100
// manually doing this because i want to make sure it handles edge cases
export function getSavingsRate(income, expenses) {
  if (income === 0) return 0
  const rate = ((income - expenses) / income) * 100
  return Math.max(0, Math.round(rate))
}

// get the month name from a date string
export function getMonthName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "long" })
}
