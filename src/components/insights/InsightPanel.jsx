import { useApp } from "../../context/AppContext"
import {
  groupByCategory,
  groupByMonth,
  formatCurrency,
  getTotalExpenses,
  getTotalIncome,
} from "../../utils/helpers"
import "./InsightPanel.css"

// figures out which day of week a date is
function getDayOfWeek(dateStr) {
  return new Date(dateStr).getDay() // 0 = Sunday, 6 = Saturday
}

function isWeekend(dateStr) {
  const day = getDayOfWeek(dateStr)
  return day === 0 || day === 6
}

export default function InsightPanel() {
  const { transactions } = useApp()

  const expenses = transactions.filter((t) => t.type === "expense")
  const catData = groupByCategory(transactions)
  const monthlyData = groupByMonth(transactions)

  // --- insight 1: highest spending category ---
  const topCategory = catData.sort((a, b) => b.value - a.value)[0]
  const totalExpenses = getTotalExpenses(transactions)
  const topCategoryPercent = totalExpenses > 0
    ? Math.round((topCategory.value / totalExpenses) * 100)
    : 0

  // --- insight 2: month over month comparison ---
  // using last two months from the data
  const lastTwo = monthlyData.slice(-2)
  const prevMonth = lastTwo[0]
  const currMonth = lastTwo[1]
  let momChange = null
  let momDirection = "same"
  if (prevMonth && currMonth && prevMonth.expense > 0) {
    momChange = Math.round(((currMonth.expense - prevMonth.expense) / prevMonth.expense) * 100)
    momDirection = momChange > 0 ? "up" : momChange < 0 ? "down" : "same"
  }

  // --- insight 3: weekend vs weekday spending ---
  const weekendTotal = expenses
    .filter((t) => isWeekend(t.date))
    .reduce((sum, t) => sum + t.amount, 0)
  const weekdayTotal = expenses
    .filter((t) => !isWeekend(t.date))
    .reduce((sum, t) => sum + t.amount, 0)

  // how many weekend days vs weekday days in the data (rough count)
  const weekendExpenseCount = expenses.filter((t) => isWeekend(t.date)).length
  const weekdayExpenseCount = expenses.filter((t) => !isWeekend(t.date)).length

  // average spend per transaction on weekends vs weekdays
  const avgWeekend = weekendExpenseCount > 0 ? Math.round(weekendTotal / weekendExpenseCount) : 0
  const avgWeekday = weekdayExpenseCount > 0 ? Math.round(weekdayTotal / weekdayExpenseCount) : 0
  const weekendMultiple = avgWeekday > 0 ? (avgWeekend / avgWeekday).toFixed(1) : "-"

  // --- insight 4: income sources ---
  const freelanceIncome = transactions
    .filter((t) => t.category === "Freelance")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = getTotalIncome(transactions)
  const freelancePercent = totalIncome > 0
    ? Math.round((freelanceIncome / totalIncome) * 100)
    : 0

  const CATEGORY_ICONS = {
    Food: "🍔", Groceries: "🛒", Bills: "📄", Transport: "🚗",
    Shopping: "🛍️", Entertainment: "🎬", Salary: "💼", Freelance: "💻", Refund: "↩️",
  }

  return (
    <div className="insight-panel page-fade">
      <div className="insight-panel__header">
        <h2 className="insight-panel__title">Insights</h2>
        <p className="insight-panel__sub">Patterns from your Jan - Mar 2026 data</p>
      </div>

      <div className="insight-grid">

        {/* insight 1 - top spending category */}
        <div className="insight-card card">
          <div className="insight-card__label">🏆 Highest Spending Category</div>
          <div className="insight-card__main">
            <span className="insight-icon">{CATEGORY_ICONS[topCategory?.name] || "💰"}</span>
            <div>
              <div className="insight-card__value">{topCategory?.name}</div>
              <div className="insight-card__detail">
                {formatCurrency(topCategory?.value)} - {topCategoryPercent}% of total spending
              </div>
            </div>
          </div>
          {/* simple bar to visualise the % */}
          <div className="insight-bar-track">
            <div
              className="insight-bar-fill insight-bar-fill--accent"
              style={{ width: `${topCategoryPercent}%` }}
            />
          </div>
        </div>

        {/* insight 2 - month over month */}
        <div className="insight-card card">
          <div className="insight-card__label">📅 Month-over-Month Spending</div>
          {prevMonth && currMonth ? (
            <>
              <div className="insight-card__main">
                <span className={`insight-badge insight-badge--${momDirection}`}>
                  {momDirection === "up" ? "▲" : momDirection === "down" ? "▼" : "-"}
                  {" "}{Math.abs(momChange)}%
                </span>
                <div>
                  <div className="insight-card__value">
                    {momDirection === "up" ? "Spending increased" : momDirection === "down" ? "Spending decreased" : "No change"}
                  </div>
                  <div className="insight-card__detail">
                    {prevMonth.month}: {formatCurrency(prevMonth.expense)} to {currMonth.month}: {formatCurrency(currMonth.expense)}
                  </div>
                </div>
              </div>
              <div className="mom-bars">
                {lastTwo.map((m) => {
                  const maxExp = Math.max(...lastTwo.map((x) => x.expense))
                  const pct = maxExp > 0 ? (m.expense / maxExp) * 100 : 0
                  return (
                    <div key={m.month} className="mom-bar-item">
                      <div className="mom-bar-track">
                        <div className="mom-bar-fill" style={{ height: `${pct}%` }} />
                      </div>
                      <span className="mom-bar-label">{m.month}</span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="insight-card__detail">Not enough data yet</p>
          )}
        </div>

        {/* insight 3 - weekend vs weekday */}
        <div className="insight-card card">
          <div className="insight-card__label">📊 Weekend vs Weekday Spending</div>
          <div className="insight-card__main">
            <span className="insight-icon">🗓️</span>
            <div>
              <div className="insight-card__value">
                {weekendMultiple}x more on weekends
              </div>
              <div className="insight-card__detail">
                Avg per transaction - Weekend: {formatCurrency(avgWeekend)} · Weekday: {formatCurrency(avgWeekday)}
              </div>
            </div>
          </div>
          <div className="insight-compare">
            <div className="insight-compare__item">
              <span className="insight-compare__label">Weekdays</span>
              <div className="insight-bar-track">
                <div
                  className="insight-bar-fill insight-bar-fill--muted"
                  style={{ width: `${avgWeekday > 0 ? Math.min((avgWeekday / Math.max(avgWeekend, avgWeekday)) * 100, 100) : 0}%` }}
                />
              </div>
              <span className="insight-compare__val">{formatCurrency(avgWeekday)}</span>
            </div>
            <div className="insight-compare__item">
              <span className="insight-compare__label">Weekends</span>
              <div className="insight-bar-track">
                <div
                  className="insight-bar-fill insight-bar-fill--accent"
                  style={{ width: `${avgWeekend > 0 ? Math.min((avgWeekend / Math.max(avgWeekend, avgWeekday)) * 100, 100) : 0}%` }}
                />
              </div>
              <span className="insight-compare__val">{formatCurrency(avgWeekend)}</span>
            </div>
          </div>
        </div>

        {/* insight 4 - income breakdown */}
        <div className="insight-card card">
          <div className="insight-card__label">💡 Income Source Breakdown</div>
          <div className="insight-card__main">
            <span className="insight-icon">💻</span>
            <div>
              <div className="insight-card__value">
                {freelancePercent}% from freelance
              </div>
              <div className="insight-card__detail">
                {formatCurrency(freelanceIncome)} in freelance out of {formatCurrency(totalIncome)} total income
              </div>
            </div>
          </div>
          <div className="insight-bar-track" style={{ marginTop: 12 }}>
            <div
              className="insight-bar-fill insight-bar-fill--purple"
              style={{ width: `${freelancePercent}%` }}
            />
          </div>
          <p className="insight-tip">
            {freelancePercent >= 20
              ? "💪 Solid side income! Diversifying revenue is always smart."
              : "📈 Growing your freelance work could boost savings significantly."}
          </p>
        </div>

      </div>
    </div>
  )
}
