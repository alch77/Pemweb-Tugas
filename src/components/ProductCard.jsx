import { formatRupiah } from '../utils/format'

// onEdit dan onDelete adalah prop fungsi dari parent.
// Keduanya dibungkus arrow function agar baru dipanggil saat tombol diklik,
// bukan saat render (onClick={() => onEdit(product)}, bukan onClick={onEdit(product)}).
export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="kartu">
      <span className="kartu-id">ID: {product.id}</span>
      <h3 className="kartu-nama">{product.name}</h3>
      <p className="kartu-harga">{formatRupiah(product.price)}</p>
      <div className="kartu-aksi">
        <button className="btn btn-kecil btn-garis" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button
          className="btn btn-kecil btn-bahaya-garis"
          onClick={() => onDelete(product)}
        >
          Hapus
        </button>
      </div>
    </article>
  )
}
