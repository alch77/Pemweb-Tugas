import { useState } from 'react'
import ProductCard from './components/ProductCard'
import SearchBar from './components/SearchBar'
import ProductFormModal from './components/ProductFormModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'

const PRODUK_AWAL = [
  { id: 1, name: 'Pulpen', price: 5000 },
  { id: 2, name: 'Buku Tulis', price: 12000 },
  { id: 3, name: 'Spidol', price: 8000 },
  { id: 4, name: 'Penggaris', price: 6000 },
  { id: 5, name: 'Penghapus', price: 3000 },
]

export default function App() {
  const [products, setProducts] = useState(PRODUK_AWAL)
  const [query, setQuery] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  function handleAdd(data) {
    const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1
    setProducts([...products, { id: nextId, ...data }])
    setShowAdd(false)
  }

  function handleEdit(data) {
    setProducts(products.map((p) => (p.id === editing.id ? { ...p, ...data } : p)))
    setEditing(null)
  }

  function handleDelete() {
    setProducts(products.filter((p) => p.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Manajemen Produk</h1>
          <p>Kelola daftar produk dan harga dalam satu tempat.</p>
        </div>
        <button className="btn btn-utama" onClick={() => setShowAdd(true)}>
          + Tambah Produk
        </button>
      </header>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <span className="jumlah">{products.length} produk</span>
      </div>

      {filtered.length === 0 ? (
        <p className="kosong">Tidak ada produk yang cocok dengan pencarian.</p>
      ) : (
        <section className="grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          ))}
        </section>
      )}

      <footer className="footer-info">
        Menampilkan {filtered.length} dari {products.length} produk
      </footer>

      {showAdd && (
        <ProductFormModal onSubmit={handleAdd} onClose={() => setShowAdd(false)} />
      )}

      {editing && (
        <ProductFormModal
          product={editing}
          onSubmit={handleEdit}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <DeleteConfirmModal
          product={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
