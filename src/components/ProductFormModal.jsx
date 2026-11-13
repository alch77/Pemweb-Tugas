import { useState } from 'react'
import Modal from './Modal'

// Jika prop `product` diberikan, form berjalan dalam mode edit.
export default function ProductFormModal({ product, onSubmit, onClose }) {
  const isEdit = Boolean(product)
  const [name, setName] = useState(product ? product.name : '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [submitted, setSubmitted] = useState(false)

  const nameValid = name.trim() !== ''
  const priceValid = Number(price) > 0

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    if (!nameValid || !priceValid) return
    onSubmit({ name: name.trim(), price: Number(price) })
  }

  const judul = isEdit ? 'Edit Produk' : 'Tambah Produk'

  return (
    <Modal title={judul} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="modal-judul">{judul}</h2>
        <p className="modal-sub">
          {isEdit
            ? 'Perbarui informasi produk yang dipilih.'
            : 'Masukkan informasi produk baru.'}
        </p>
        {isEdit && <p className="modal-id">ID: {product.id}</p>}

        <label className="field">
          <span>Nama Produk</span>
          <input
            type="text"
            placeholder="Contoh: Pulpen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {submitted && !nameValid && (
            <small className="galat">Nama produk wajib diisi.</small>
          )}
        </label>

        <label className="field">
          <span>Harga (Rp)</span>
          <input
            type="number"
            placeholder="Contoh: 5000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <small className={submitted && !priceValid ? 'galat' : 'petunjuk'}>
            Harga harus lebih dari 0.
          </small>
        </label>

        <div className="modal-aksi">
          <button type="button" className="btn btn-garis" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn btn-utama">
            {isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
