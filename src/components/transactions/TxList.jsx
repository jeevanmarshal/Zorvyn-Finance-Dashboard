import { useState } from "react"
import { useApp } from "../../context/AppContext"
import FilterBar from "./FilterBar"
import TxRow from "./TxRow"
import TxModal from "./TxModal"
import "./TxList.css"

export default function TxList() {
  const { filteredTransactions, role } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editTx, setEditTx] = useState(null)

  function handleEdit(tx) {
    setEditTx(tx)
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditTx(null)
  }

  function handleAddNew() {
    setEditTx(null)
    setShowModal(true)
  }

  // export to csv - one of the optional features, not too hard to implement
  function handleExportCSV() {
    const headers = ["Date", "Description", "Category", "Type", "Amount"]
    const rows = filteredTransactions.map((t) => [
      t.date,
      `"${t.description}"`,
      t.category,
      t.type,
      t.amount,
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="tx-list page-fade">
      <div className="tx-list__header">
        <div>
          <h2 className="tx-list__title">Transactions</h2>
          <p className="tx-list__count">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="tx-list__actions">
          <button className="tx-header-btn tx-header-btn--export" onClick={handleExportCSV}>
            ↓ Export CSV
          </button>
          {role === "admin" && (
            <button className="tx-header-btn tx-header-btn--add" onClick={handleAddNew}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      <FilterBar />

      <div className="card tx-list__table">
        {filteredTransactions.length === 0 ? (
          <div className="tx-empty">
            <span className="tx-empty__icon">🔍</span>
            <p className="tx-empty__text">No transactions match your filters</p>
            <p className="tx-empty__sub">Try adjusting the search or filter options</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <TxRow key={tx.id} tx={tx} onEdit={handleEdit} />
          ))
        )}
      </div>

      {showModal && (
        <TxModal editTx={editTx} onClose={handleCloseModal} />
      )}
    </div>
  )
}
