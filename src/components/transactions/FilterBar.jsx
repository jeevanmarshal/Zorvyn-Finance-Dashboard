import { useApp } from "../../context/AppContext"
import CustomSelect from "../ui/CustomSelect"
import "./FilterBar.css"

const TYPE_OPTIONS = [
  { value: "all",     label: "All types" },
  { value: "income",  label: "Income only" },
  { value: "expense", label: "Expense only" },
]

const CATEGORY_OPTIONS = [
  { value: "all",           label: "All categories" },
  { value: "Food",          label: "Food" },
  { value: "Groceries",     label: "Groceries" },
  { value: "Bills",         label: "Bills" },
  { value: "Transport",     label: "Transport" },
  { value: "Shopping",      label: "Shopping" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Salary",        label: "Salary" },
  { value: "Freelance",     label: "Freelance" },
  { value: "Refund",        label: "Refund" },
]

const SORT_OPTIONS = [
  { value: "date-desc",   label: "Newest first" },
  { value: "date-asc",    label: "Oldest first" },
  { value: "amount-desc", label: "High to low" },
  { value: "amount-asc",  label: "Low to high" },
]

export default function FilterBar() {
  const { filters, updateFilter } = useApp()

  function handleReset() {
    updateFilter("type", "all")
    updateFilter("category", "all")
    updateFilter("search", "")
    updateFilter("sortBy", "date")
    updateFilter("sortDir", "desc")
  }

  function handleSortChange(e) {
    const [by, dir] = e.target.value.split("-")
    updateFilter("sortBy", by)
    updateFilter("sortDir", dir)
  }

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.search !== ""

  // everything lives in ONE row — search stretches, dropdowns are fixed width
  return (
    <div className="filter-bar">
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          id="tx-search"
          name="tx-search"
          type="text"
          className="search-input"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          autoComplete="off"
        />
        {filters.search && (
          <button className="search-clear" onClick={() => updateFilter("search", "")}>✕</button>
        )}
      </div>

      <CustomSelect
        id="tx-type-filter"
        name="type"
        value={filters.type}
        onChange={(e) => updateFilter("type", e.target.value)}
        options={TYPE_OPTIONS}
        className="fb-select"
      />

      <CustomSelect
        id="tx-category-filter"
        name="category"
        value={filters.category}
        onChange={(e) => updateFilter("category", e.target.value)}
        options={CATEGORY_OPTIONS}
        className="fb-select"
      />

      <CustomSelect
        id="tx-sort"
        name="sort"
        value={`${filters.sortBy}-${filters.sortDir}`}
        onChange={handleSortChange}
        options={SORT_OPTIONS}
        className="fb-select"
      />

      {hasActiveFilters && (
        <button className="filter-reset" onClick={handleReset}>Clear</button>
      )}
    </div>
  )
}
