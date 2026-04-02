import { useState, useEffect } from "react"
import { useApp } from "../../context/AppContext"
import CustomSelect from "../ui/CustomSelect"
import "./TxModal.css"

const TYPE_OPTIONS = [
  { value: "expense", label: "Expense" },
  { value: "income",  label: "Income" },
]

const CATEGORY_OPTIONS = [
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

// generate day/month/year options so we don't need a native date picker
const DAY_OPTIONS   = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1).padStart(2,"0"), label: String(i + 1) }))
const MONTH_OPTIONS = [
  { value: "01", label: "January" }, { value: "02", label: "February" },
  { value: "03", label: "March" },   { value: "04", label: "April" },
  { value: "05", label: "May" },     { value: "06", label: "June" },
  { value: "07", label: "July" },    { value: "08", label: "August" },
  { value: "09", label: "September"},{ value: "10", label: "October" },
  { value: "11", label: "November"}, { value: "12", label: "December" },
]
const YEAR_OPTIONS  = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
]

function todayParts() {
  const d = new Date()
  return {
    day:   String(d.getDate()).padStart(2,"0"),
    month: String(d.getMonth() + 1).padStart(2,"0"),
    year:  String(d.getFullYear()),
  }
}

function parseDateParts(dateStr) {
  if (!dateStr) return todayParts()
  const [year, month, day] = dateStr.split("-")
  return { day, month, year }
}

export default function TxModal({ editTx, onClose }) {
  const { addTransaction, updateTransaction } = useApp()
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "Food",
  })
  const [dateParts, setDateParts] = useState(todayParts())
  const [error, setError] = useState("")
  const isEditing = !!editTx

  // iOS-safe scroll lock: position:fixed is the only reliable cross-browser fix
  useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position   = "fixed"
    document.body.style.top        = `-${scrollY}px`
    document.body.style.width      = "100%"
    document.body.style.overflowY  = "scroll" // keep scrollbar width so layout doesn't jump
    return () => {
      document.body.style.position  = ""
      document.body.style.top       = ""
      document.body.style.width     = ""
      document.body.style.overflowY = ""
      window.scrollTo(0, scrollY)
    }
  }, [])

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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  function handleDateChange(part, value) {
    setDateParts((prev) => ({ ...prev, [part]: value }))
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

  return (
    <div className="modal-backdrop backdrop-enter" onClick={handleBackdropClick}>
      <div className="modal modal-enter">
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? "Edit Transaction" : "Add Transaction"}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          {/* description */}
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

          {/* amount + type */}
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
              <CustomSelect id="tx-type" name="type" value={form.type} onChange={handleChange} options={TYPE_OPTIONS} />
            </label>
          </div>

          {/* category */}
          <label className="modal-label">
            Category
            <CustomSelect id="tx-category" name="category" value={form.category} onChange={handleChange} options={CATEGORY_OPTIONS} />
          </label>

          {/* date — three dropdowns instead of native date input */}
          <div className="modal-label">
            Date
            <div className="date-row">
              <CustomSelect
                id="tx-day" name="day"
                value={dateParts.day}
                onChange={(e) => handleDateChange("day", e.target.value)}
                options={DAY_OPTIONS}
              />
              <CustomSelect
                id="tx-month" name="month"
                value={dateParts.month}
                onChange={(e) => handleDateChange("month", e.target.value)}
                options={MONTH_OPTIONS}
              />
              <CustomSelect
                id="tx-year" name="year"
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
    </div>
  )
}
