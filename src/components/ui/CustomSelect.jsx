import { useState, useRef, useEffect } from "react"
import "./CustomSelect.css"

// replacing all native <select> elements with this so we can style the
// dropdown list properly - native selects can't have border-radius on the list

export default function CustomSelect({ id, name, value, onChange, options, className = "" }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const listRef = useRef(null)

  const selected = options.find((o) => o.value === value) || options[0]

  // close when clicking outside
  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  // flip the list upward if it would overflow the bottom of the viewport
  useEffect(() => {
    if (!open || !listRef.current || !ref.current) return
    const triggerRect = ref.current.getBoundingClientRect()
    const listHeight = listRef.current.offsetHeight
    const spaceBelow = window.innerHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top

    if (spaceBelow < listHeight && spaceAbove > spaceBelow) {
      listRef.current.classList.add("custom-select__list--up")
    } else {
      listRef.current.classList.remove("custom-select__list--up")
    }
  }, [open])

  function handleSelect(e, val) {
    // preventDefault stops the mousedown from triggering the outside-click
    // listener before the selection registers — fixes dropdown not closing
    e.preventDefault()
    e.stopPropagation()
    onChange({ target: { name, value: val } })
    setOpen(false)
  }

  // keyboard navigation
  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpen((o) => !o)
    }
    if (e.key === "Escape") setOpen(false)
    if (e.key === "ArrowDown" && !open) setOpen(true)
  }

  return (
    <div
      ref={ref}
      className={`custom-select ${className} ${open ? "custom-select--open" : ""}`}
      id={id}
    >
      <button
        type="button"
        className="custom-select__trigger"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        name={name}
      >
        <span className="custom-select__value">{selected?.label}</span>
        <span className="custom-select__arrow">▾</span>
      </button>

      {open && (
        <ul
          ref={listRef}
          className="custom-select__list"
          role="listbox"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`custom-select__option ${opt.value === value ? "custom-select__option--selected" : ""}`}
              onMouseDown={(e) => handleSelect(e, opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
