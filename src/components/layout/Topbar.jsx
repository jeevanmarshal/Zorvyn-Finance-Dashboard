import { useApp } from "../../context/AppContext"
import "./Topbar.css"

export default function Topbar({ activeTab, setActiveTab }) {
  const { role, setRole, darkMode, setDarkMode } = useApp()

  function handleDarkToggle() {
    const next = !darkMode
    setDarkMode(next)
    // applying class to body so css variables kick in
    document.body.classList.toggle("dark", next)
  }

  const tabs = ["Dashboard", "Transactions", "Insights"]

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-logo">💰</span>
        <span className="topbar-title">FinTrack</span>
      </div>

      <nav className="topbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "tab-btn--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="topbar-right">
        {/* role switcher - this is the rbac demo part */}
        <select
          className="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          title="Switch role"
        >
          <option value="viewer">👁 Viewer</option>
          <option value="admin">🛠 Admin</option>
        </select>

        <button
          className="dark-toggle"
          onClick={handleDarkToggle}
          title="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  )
}
