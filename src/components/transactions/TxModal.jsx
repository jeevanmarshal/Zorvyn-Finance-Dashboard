import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useApp } from "../../context/AppContext"
import CustomSelect from "../ui/CustomSelect"
import "./TxModal.css"

const TYPE_OPTIONS = [
  { value: "expense", label: "Expense" },
  { value: "income",  label: "Income" },
]

// split categories by type so each dropdown only shows relevant options
const INCOME_CATEGORIES = [
  { value: "Salary",    label: "Salary" },
  { value: "Freelance", label: "Freelance" },
  { value: "Refund",    label: "Refund" },
]

const EXPENSE_CATEGORIES = [
  { value: "Food",          label: "Food" },
  { value: "Groceries",     label: "Groceries" },
  { value: "Bills",         label: "Bills" },
  { value: "Transport",     label: "Transport" },
  { value: "Shopping",      label: "Shopping" },
  { value: "Entertainment", label: "Entertainment" },
]

// returns the right category list for the given type
function categoriesFor(type) {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

// returns the default first category for the given type
function defaultCategory(type) {
  return categoriesFor(type)[0].value
}

// ── date helpers ────────────────────────────────────────────
// today's actual values — used to cap all dropdowns
const TODAY = new Date()
const TODAY_YEAR  = TODAY.getFullYear()
const TODAY_MONTH = TODAY.getMonth() + 1   // 1-based
const TODAY_DAY   = TODAY.getDate()

// only allow years from 2024 up to current year (no future years)
const YEAR_OPTIONS = Array.from(
  { length: TODAY_YEAR - 2023 },
  (_, i) => {
    const y = String(2024 + i)
    return { value: y, label: y }
  }
)

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

// months available depend on selected year
function getMonthOptions(year) {
  const maxMonth = Number(year) === TODAY_YEAR ? TODAY_MONTH : 12
  return Array.from({ length: maxMonth }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: MONTH_NAMES[i],
  }))
}

// days available depend on selected year+month
function getDayOptions(year, month) {
  const y = Number(year)
  const m = Number(month)
  // actual days in that month (handles Feb + leap years correctly)
  const daysInMonth = new Date(y, m, 0).getDate()
  const maxDay = (y === TODAY_YEAR && m === TODAY_MONTH) ? TODAY_DAY : daysInMonth
  return Array.from({ length: maxDay }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1),
  }))
}

function todayParts() {
  return {
    day:   String(TODAY_DAY).padStart(2, "0"),
    month: String(TODAY_MONTH).padStart(2, "0"),
    year:  String(TODAY_YEAR),
  }
}

function parseDateParts(dateStr) {
  if (!dateStr) return todayParts()
  const [year, month, day] = dateStr.split("-")
  return { day, month, year }
}

// clamp a day/month value so it never exceeds the allowed max
function clampDateParts(parts) {
  const y = Number(parts.year)
  const m = Number(parts.month)
  const maxMonth = y === TODAY_YEAR ? TODAY_MONTH : 12
  const clampedMonth = Math.min(m, maxMonth)
  const daysInMonth = new Date(y, clampedMonth, 0).getDate()
  const maxDay = (y === TODAY_YEAR && clampedMonth === TODAY_MONTH) ? TODAY_DAY : daysInMonth
  const clampedDay = Math.min(Number(parts.day), maxDay)
  return {
    year:  parts.year,
    month: String(clampedMonth).padStart(2, "0"),
    day:   String(clampedDay).padStart(2, "0"),
  }
}
// ────────────────────────────────────────────────────────────

export default function TxModal({ editTx, onClose }) {
  const { addTransaction, updateTransaction } = useApp()

  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: defaultCategory("expense"),
  })
  const [dateParts, setDateParts] = useState(todayParts())
  const [error, setError] = useState("")
  const isEditing = !!editTx

  // iOS-safe scroll lock
  useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position  = "fixed"
    document.body.style.top       = `-${scrollY}px`
    document.body.style.width     = "100%"
    document.body.style.overflowY = "scroll"
    return () => {
      document.body.style.position  = ""
      document.body.style.top       = ""
      document.body.style.width     = ""
      document.body.style.overflowY = ""
      window.scrollTo(0, scrollY)
    }
  }, [])

  // pre-fill form when editing
  useEffect(() => {
    if (editTx) {
      setForm({
        description: editTx.description,
        amount:      editTx.amount,
        type:        editTx.type,
        category:    editTx.category,
      })
      setDateParts(parseDateParts(editTx.date))
    }
  }, [editTx])

  function handleChange(e) {
    const { name, value } = e.target

    if (name === "type") {
      // when type switches, reset category to the first valid option for that type
      setForm((prev) => ({
        ...prev,
        type: value,
        category: defaultCategory(value),
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
    setError("")
  }

  function handleDateChange(part, value) {
    // after changing year or month, clamp day/month so they don't exceed today
    const updated = clampDateParts({ ...dateParts, [part]: value })
    setDateParts(updated)
  }

  function handleSubmit() {
    if (!form.description.trim()) { setError("Please enter a description"); return }
    if (!form.amount || Number(form.amount) < 0) { setError("Please enter a valid amount"); return }
    const date = `${dateParts.year}-${dateParts.month}-${dateParts.day}`
    const tx = { ...form, amount: Number(form.amount), date }
    if (isEditing) { updateTransaction(editTx.id, tx) } else { addTransaction(tx) }
    onClose()
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  // compute available options based on current selections
  const availableCategories = categoriesFor(form.type)
  const monthOptions = getMonthOptions(dateParts.year)
  const dayOptions   = getDayOptions(dateParts.year, dateParts.month)

  return createPortal(
    <div className="modal-backdrop backdrop-enter" onClick={handleBackdropClick}>
      <div className="modal modal-enter">
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? "Edit Transaction" : "Add Transaction"}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <label className="modal-label" htmlFor="tx-desc">
            Description
            <input
              id="tx-desc"
              name="description"
              className="modal-input"
              placeholder="e.g. Zomato order"
              value={form.description}
              onChange={handleChange}
              autoComplete="off"
            />
          </label>

          <div className="modal-row">
            <label className="modal-label" htmlFor="tx-amount">
              Amount (₹)
              <input
                id="tx-amount"
                name="amount"
                type="number"
                min="0"
                className="modal-input"
                placeholder="0"
                value={form.amount}
                onChange={handleChange}
              />
            </label>
            <label className="modal-label">
              Type
              <CustomSelect
                id="tx-type"
                name="type"
                value={form.type}
                onChange={handleChange}
                options={TYPE_OPTIONS}
              />
            </label>
          </div>

          {/* category list changes based on selected type */}
          <label className="modal-label">
            Category
            <CustomSelect
              id="tx-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={availableCategories}
            />
          </label>

          {/* date — three dropdowns capped at today */}
          <div className="modal-label">
            Date
            <div className="date-row">
              <CustomSelect
                id="tx-day"
                name="day"
                value={dateParts.day}
                onChange={(e) => handleDateChange("day", e.target.value)}
                options={dayOptions}
              />
              <CustomSelect
                id="tx-month"
                name="month"
                value={dateParts.month}
                onChange={(e) => handleDateChange("month", e.target.value)}
                options={monthOptions}
              />
              <CustomSelect
                id="tx-year"
                name="year"
                value={dateParts.year}
                onChange={(e) => handleDateChange("year", e.target.value)}
                options={YEAR_OPTIONS}
              />
            </div>
          </div>

          {error && <p className="modal-error">{error}</p>}
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn--submit" onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
