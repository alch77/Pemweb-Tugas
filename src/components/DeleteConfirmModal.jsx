import Modal from './Modal'
import { formatRupiah } from '../utils/format'

export default function DeleteConfirmModal({ product, onConfirm, onClose }) {
  return (
    <Modal title="Hapus Produk?" onClose={onClose}>
      <div className="hapus-ikon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="modal-judul tengah">Hapus Produk?</h2>
      <p className="modal-sub tengah">
        Produk yang dihapus tidak dapat dikembalikan.
      </p>

      <div className="hapus-ringkas">
        <span className="kartu-id">ID: {product.id}</span>
        <strong>{product.name}</strong>
        <span className="kartu-harga">{formatRupiah(product.price)}</span>
      </div>

      <div className="modal-aksi">
        <button className="btn btn-garis" onClick={onClose}>
          Batal
        </button>
        <button className="btn btn-bahaya" onClick={onConfirm}>
          Hapus Produk
        </button>
      </div>
    </Modal>
  )
}
