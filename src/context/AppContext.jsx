import { createContext, useContext, useState } from "react"
import myTransactions from "../data/myTransactions"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(myTransactions)
  const [role, setRole] = useState("viewer") // "viewer" or "admin"
  const [darkMode, setDarkMode] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",       // "all", "income", "expense"
    category: "all",
    search: "",
    sortBy: "date",    // "date" or "amount"
    sortDir: "desc",
  })

  function addTransaction(newTx) {
    // only admin should be calling this but checking just in case
    if (role !== "admin") return
    const withId = { ...newTx, id: Date.now() }
    setTransactions((prev) => [withId, ...prev])
  }

  function updateTransaction(id, updated) {
    if (role !== "admin") return
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    )
  }

  function deleteTransaction(id) {
    if (role !== "admin") return
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // applying all the filters in one place
  const filteredTransactions = transactions.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false
    if (filters.category !== "all" && t.category !== filters.category) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const matchDesc = t.description.toLowerCase().includes(q)
      const matchAmt = t.amount.toString().includes(q)
      if (!matchDesc && !matchAmt) return false
    }
    return true
  }).sort((a, b) => {
    if (filters.sortBy === "amount") {
      return filters.sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount
    }
    // default sort by date
    return filters.sortDir === "desc"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  })

  const value = {
    transactions,
    filteredTransactions,
    role,
    setRole,
    darkMode,
    setDarkMode,
    filters,
    updateFilter,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// custom hook so i don't have to import useContext everywhere
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside AppProvider")
  return ctx
}
