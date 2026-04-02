import { useState, useEffect } from "react"
import { useApp } from "../../context/AppContext"
import "./TxModal.css"

const CATEGORIES = ["Food", "Groceries", "Bills", "Transport", "Shopping", "Entertainment", "Salary", "Freelance", "Refund"]

const emptyForm = {
  description: "",
  amount: "",
  type: "expense",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
}

export default function TxModal({ editTx, onClose }) {
  const { addTransaction, updateTransaction } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState("")

  const isEditing = !!editTx

  // pre-fill the form if editing an existing transaction
  useEffect(() => {
    if (editTx) {
      setForm({
        description: editTx.description,
        amount: editTx.amount,
        type: editTx.type,
        category: editTx.category,
        date: editTx.date,
      })
    }
  }, [editTx])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  function handleSubmit() {
    if (!form.description.trim()) {
      setError("Please enter a description")
      return
    }
    if (!form.amount || Number(form.amount) < 0) {
      setError("Please enter a valid amount")
      return
    }

    const tx = {
      ...form,
      amount: Number(form.amount),
    }

    if (isEditing) {
      updateTransaction(editTx.id, tx)
    } else {
      addTransaction(tx)
    }

    onClose()
  }

  // close on backdrop click
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
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

            <label className="modal-label" htmlFor="tx-type">
              Type
              <select id="tx-type" name="type" className="modal-input" value={form.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
          </div>

          <div className="modal-row">
            <label className="modal-label" htmlFor="tx-category">
              Category
              <select id="tx-category" name="category" className="modal-input" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="modal-label" htmlFor="tx-date">
              Date
              <input
                id="tx-date"
                name="date"
                type="date"
                className="modal-input"
                value={form.date}
                onChange={handleChange}
              />
            </label>
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
