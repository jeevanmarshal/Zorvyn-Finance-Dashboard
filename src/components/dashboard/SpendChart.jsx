import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useApp } from "../../context/AppContext"
import { groupByMonth, formatCurrency } from "../../utils/helpers"
import "./SpendChart.css"

// custom tooltip so it shows ₹ instead of raw numbers
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="chart-tooltip__row">
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export default function SpendChart() {
  const { transactions } = useApp()
  const monthlyData = groupByMonth(transactions)

  return (
    <div className="card spend-chart">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Monthly Overview</h3>
          <p className="chart-subtitle">Income vs Expenses - Jan to Mar 2026</p>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={monthlyData}
            margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 13, fill: "var(--text-secondary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface-2)" }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 13, paddingTop: 16 }}
            />
            <Bar dataKey="income" name="Income" fill="var(--income-color)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="var(--expense-color)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
