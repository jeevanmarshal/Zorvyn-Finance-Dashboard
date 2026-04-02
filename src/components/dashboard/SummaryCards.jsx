import { useApp } from "../../context/AppContext"
import {
  getTotalIncome,
  getTotalExpenses,
  getSavingsRate,
  formatCurrency,
} from "../../utils/helpers"
import "./SummaryCards.css"

export default function SummaryCards() {
  const { transactions } = useApp()

  const totalIncome = getTotalIncome(transactions)
  const totalExpenses = getTotalExpenses(transactions)
  const balance = totalIncome - totalExpenses
  const savingsRate = getSavingsRate(totalIncome, totalExpenses)

  const cards = [
    {
      label: "Total Balance",
      value: formatCurrency(balance),
      icon: "🏦",
      colorClass: "card--balance",
      sub: "across all months",
    },
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      icon: "📈",
      colorClass: "card--income",
      sub: "Jan – Mar 2026",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: "📉",
      colorClass: "card--expense",
      sub: "Jan – Mar 2026",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      icon: "💎",
      colorClass: "card--savings",
      sub: savingsRate >= 30 ? "Great job! 🎉" : "Room to improve",
    },
  ]

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card ${card.colorClass}`}>
          <div className="summary-card__top">
            <span className="summary-card__icon">{card.icon}</span>
            <span className="summary-card__label">{card.label}</span>
          </div>
          <div className="summary-card__value">{card.value}</div>
          <div className="summary-card__sub">{card.sub}</div>
        </div>
      ))}
    </div>
  )
}
