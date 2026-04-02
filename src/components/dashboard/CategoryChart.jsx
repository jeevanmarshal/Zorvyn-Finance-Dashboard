import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useApp } from "../../context/AppContext"
import { groupByCategory, formatCurrency } from "../../utils/helpers"
import "./CategoryChart.css"

// picked these colors manually - wanted something that doesn't look like a default palette
const COLORS = ["#0f766e", "#7c3aed", "#dc2626", "#d97706", "#0284c7", "#65a30d", "#db2777"]

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{item.name}</p>
      <p style={{ color: item.payload.fill }} className="chart-tooltip__row">
        {formatCurrency(item.value)}
      </p>
    </div>
  )
}

// custom label inside the donut center
function CenterLabel({ viewBox, total }) {
  if (!viewBox) return null        // ← add this line
  const { cx, cy } = viewBox
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} dy="-6" fontSize="11" fill="var(--text-muted)">Total spent</tspan>
      <tspan x={cx} dy="20" fontSize="15" fontWeight="700" fill="var(--text-primary)">
        {formatCurrency(total)}
      </tspan>
    </text>
  )
}

export default function CategoryChart() {
  const { transactions } = useApp()
  const catData = groupByCategory(transactions)
  const totalSpent = catData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="card category-chart">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Spending Breakdown</h3>
          <p className="chart-subtitle">By category — all months</p>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={catData}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {catData.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
              <CenterLabel total={totalSpent} />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
