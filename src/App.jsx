import { useState } from "react"
import { AppProvider } from "./context/AppContext"
import Topbar from "./components/layout/Topbar"
import MobileNav from "./components/layout/MobileNav"
import SummaryCards from "./components/dashboard/SummaryCards"
import SpendChart from "./components/dashboard/SpendChart"
import CategoryChart from "./components/dashboard/CategoryChart"
import TxList from "./components/transactions/TxList"
import InsightPanel from "./components/insights/InsightPanel"
import "./index.css"
import "./App.css"

function DashboardPage() {
  return (
    <div>
      <SummaryCards />
      <div className="charts-row">
        <SpendChart />
        <CategoryChart />
      </div>
    </div>
  )
}

function AppContent() {
  const [activeTab, setActiveTab] = useState("Dashboard")

  // the key prop here is the magic — when activeTab changes React unmounts
  // and remounts the wrapper, which re-triggers the page-enter animation
  return (
    <div>
      <Topbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-main">
        <div key={activeTab} className="page-enter">
          {activeTab === "Dashboard"    && <DashboardPage />}
          {activeTab === "Transactions" && <TxList />}
          {activeTab === "Insights"     && <InsightPanel />}
        </div>
      </main>
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
