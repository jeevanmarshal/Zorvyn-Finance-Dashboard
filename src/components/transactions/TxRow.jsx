import { useApp } from "../../context/AppContext"
import { formatCurrency, formatDate } from "../../utils/helpers"
import "./TxRow.css"

// mapping categories to emojis - makes the table way more scannable
const CATEGORY_ICONS = {
  Food: "🍔",
  Groceries: "🛒",
  Bills: "📄",
  Transport: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Salary: "💼",
  Freelance: "💻",
  Refund: "↩️",
}

export default function TxRow({ tx, onEdit, index = 0 }) {
  const { role, deleteTransaction } = useApp()

  // cap the delay so the 20th row doesn't wait 2 seconds
  const delay = Math.min(index * 0.04, 0.4)

  return (
    <div
      className="tx-row tx-row-enter"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="tx-row__icon">
        {CATEGORY_ICONS[tx.category] || "💰"}
      </div>

      <div className="tx-row__info">
        <span className="tx-row__desc">{tx.description}</span>
        <span className="tx-row__meta">
          {tx.category} · {formatDate(tx.date)}
        </span>
      </div>

      <span className={`tx-row__type tx-row__type--${tx.type}`}>
        {tx.type}
      </span>

      <span className={`tx-row__amount tx-row__amount--${tx.type}`}>
        {tx.type === "expense" ? "−" : "+"}{formatCurrency(tx.amount)}
      </span>

      {/* admin controls - only visible in admin mode */}
      {role === "admin" && (
        <div className="tx-row__actions">
          <button
            className="tx-action-btn tx-action-btn--edit"
            onClick={() => onEdit(tx)}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="tx-action-btn tx-action-btn--delete"
            onClick={() => deleteTransaction(tx.id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  )
}
