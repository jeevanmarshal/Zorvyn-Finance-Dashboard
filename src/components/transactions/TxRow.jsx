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

export default function TxRow({ tx, onEdit }) {
  const { role, deleteTransaction } = useApp()

  return (
    <div className="tx-row">
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
