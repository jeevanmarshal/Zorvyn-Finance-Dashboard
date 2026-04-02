import { useApp } from "../../context/AppContext"
import "./FilterBar.css"

// all the categories from our data
const CATEGORIES = ["Food", "Groceries", "Bills", "Transport", "Shopping", "Entertainment", "Salary", "Freelance", "Refund"]

export default function FilterBar() {
  const { filters, updateFilter } = useApp()

  function handleReset() {
    updateFilter("type", "all")
    updateFilter("category", "all")
    updateFilter("search", "")
    updateFilter("sortBy", "date")
    updateFilter("sortDir", "desc")
  }

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.search !== ""

  return (
    <div className="filter-bar">
      <div className="filter-bar__inputs">
        {/* search box */}
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            id="tx-search"
            name="tx-search"
            type="text"
            className="filter-input search-input"
            placeholder="Search by name or amount..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            autoComplete="off"
          />
          {filters.search && (
            <button className="search-clear" onClick={() => updateFilter("search", "")}>✕</button>
          )}
        </div>

        {/* type filter */}
        <select
          id="tx-type-filter"
          name="tx-type-filter"
          className="filter-input filter-select"
          value={filters.type}
          onChange={(e) => updateFilter("type", e.target.value)}
        >
          <option value="all">All types</option>
          <option value="income">Income only</option>
          <option value="expense">Expense only</option>
        </select>

        {/* category filter */}
        <select
          id="tx-category-filter"
          name="tx-category-filter"
          className="filter-input filter-select"
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* sort */}
        <select
          id="tx-sort"
          name="tx-sort"
          className="filter-input filter-select"
          value={`${filters.sortBy}-${filters.sortDir}`}
          onChange={(e) => {
            const [by, dir] = e.target.value.split("-")
            updateFilter("sortBy", by)
            updateFilter("sortDir", dir)
          }}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Amount: high to low</option>
          <option value="amount-asc">Amount: low to high</option>
        </select>
      </div>

      {/* only show reset when something is active */}
      {hasActiveFilters && (
        <button className="filter-reset" onClick={handleReset}>
          Clear filters
        </button>
      )}
    </div>
  )
}
