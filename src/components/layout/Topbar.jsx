import { useApp } from "../../context/AppContext"
import CustomSelect from "../ui/CustomSelect"
import "./Topbar.css"

const ROLE_OPTIONS = [
  { value: "viewer", label: "👁 Viewer" },
  { value: "admin",  label: "🛠 Admin" },
]

export default function Topbar({ activeTab, setActiveTab }) {
  const { role, setRole, darkMode, setDarkMode } = useApp()

  function handleDarkToggle() {
    const next = !darkMode
    setDarkMode(next)
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
        <CustomSelect
          id="role-switcher"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={ROLE_OPTIONS}
          className="role-select-custom"
        />

        <button className="dark-toggle" onClick={handleDarkToggle} title="Toggle dark mode">
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  )
}
