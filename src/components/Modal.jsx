import { useEffect } from 'react'

// Pembungkus pop-up: menutup saat tombol X, klik latar, atau tombol Escape ditekan.
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-tutup" onClick={onClose} aria-label="Tutup">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
