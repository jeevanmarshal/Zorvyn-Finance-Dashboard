import "./MobileNav.css"

const TABS = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Transactions", icon: "📋" },
  { name: "Insights", icon: "💡" },
]

export default function MobileNav({ activeTab, setActiveTab }) {
  return (
    <nav className="mobile-nav">
      {TABS.map((tab) => (
        <button
          key={tab.name}
          className={`mobile-nav__btn ${activeTab === tab.name ? "mobile-nav__btn--active" : ""}`}
          onClick={() => setActiveTab(tab.name)}
        >
          <span className="mobile-nav__icon">{tab.icon}</span>
          <span className="mobile-nav__label">{tab.name}</span>
        </button>
      ))}
    </nav>
  )
}
