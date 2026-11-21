import { useState } from "react"
import { TbTrash } from "react-icons/tb"
import type { Product } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"
import Alert from "../../atoms/Alert"
import Button from "../../atoms/Button"

type DeleteConfirmDialogProps = {
    product: Product
    onConfirm: () => Promise<void>
    onCancel: () => void
}

export default function DeleteConfirmDialog({
    product,
    onConfirm,
    onCancel,
}: DeleteConfirmDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState("")

    async function handleConfirm() {
        setIsDeleting(true)
        setError("")
        try {
            await onConfirm()
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal menghapus produk.")
            setIsDeleting(false)
        }
    }

    return (
        <div>
            <div
                className="mx-auto mt-2 mb-3 flex size-11 items-center justify-center rounded-xl bg-red-100 text-red-600"
                aria-hidden="true"
            >
                <TbTrash className="size-6" />
            </div>
            <h2 className="text-center text-2xl font-extrabold">
                Hapus Produk?
            </h2>
            <p className="mt-1 mb-4 text-center text-sm text-slate-500">
                Produk yang dihapus tidak dapat dikembalikan.
            </p>

            <div className="mb-4 rounded-lg border border-slate-200 p-3">
                <span className="text-xs font-semibold text-slate-500">
                    ID: {product.id}
                </span>
                <p className="text-lg font-extrabold">{product.name}</p>
                <p className="font-extrabold text-blue-600">
                    {formatRupiah(product.price)}
                </p>
            </div>

            {error && <Alert>{error}</Alert>}

            <div className="mt-5 flex gap-2.5">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={isDeleting}
                >
                    Batal
                </Button>
                <Button
                    variant="danger"
                    className="flex-1"
                    onClick={handleConfirm}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Menghapus…" : "Hapus Produk"}
                </Button>
            </div>
        </div>
    )
}
