// Input terkontrol: nilai berasal dari state parent, perubahan dikirim lewat onChange.
export default function SearchBar({ value, onChange }) {
  return (
    <label className="cari">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        placeholder="Cari nama produk..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
