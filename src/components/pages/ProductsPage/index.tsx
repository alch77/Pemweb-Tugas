import { useState } from "react"
import { TbPlus } from "react-icons/tb"
import type { Product, ProductValues } from "../../../types/product"
import { useProducts } from "../../../hooks/useProducts"
import Alert from "../../atoms/Alert"
import Button from "../../atoms/Button"
import Spinner from "../../atoms/Spinner"
import Modal from "../../molecules/Modal"
import SearchBar from "../../molecules/SearchBar"
import DeleteConfirmDialog from "../../organisms/DeleteConfirmDialog"
import ProductForm from "../../organisms/ProductForm"
import ProductGrid from "../../organisms/ProductGrid"

type Dialog =
    | { type: "add" }
    | { type: "edit"; product: Product }
    | { type: "delete"; product: Product }
    | null

export default function ProductsPage() {
    const {
        products,
        status,
        error,
        reload,
        addProduct,
        editProduct,
        removeProduct,
    } = useProducts()
    const [query, setQuery] = useState("")
    const [dialog, setDialog] = useState<Dialog>(null)
    const [message, setMessage] = useState("")

    const keyword = query.trim().toLowerCase()
    const visible = products.filter((product) =>
        product.name.toLowerCase().includes(keyword),
    )

    function closeDialog() {
        setDialog(null)
    }

    async function handleAdd(values: ProductValues) {
        await addProduct(values)
        setMessage(`Produk "${values.name}" berhasil ditambahkan.`)
        closeDialog()
    }

    async function handleEdit(id: number, values: ProductValues) {
        await editProduct(id, values)
        setMessage(`Produk "${values.name}" berhasil diperbarui.`)
        closeDialog()
    }

    async function handleDelete(product: Product) {
        await removeProduct(product.id)
        setMessage(`Produk "${product.name}" berhasil dihapus.`)
        closeDialog()
    }

    return (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold">
                        Manajemen Produk
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Kelola daftar produk dan harga dalam satu tempat.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setMessage("")
                        setDialog({ type: "add" })
                    }}
                >
                    <TbPlus className="size-4" aria-hidden="true" />
                    Tambah Produk
                </Button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar value={query} onChange={setQuery} />
                <span className="text-xs text-slate-500">
                    {products.length} produk
                </span>
            </div>

            {message && (
                <div className="mt-4">
                    <Alert tone="success">{message}</Alert>
                </div>
            )}

            <section className="mt-5" aria-busy={status === "loading"}>
                {status === "loading" && <Spinner label="Memuat produk…" />}

                {status === "error" && (
                    <div className="flex flex-col items-start gap-3">
                        <Alert>{error}</Alert>
                        <Button variant="outline" size="sm" onClick={reload}>
                            Coba lagi
                        </Button>
                    </div>
                )}

                {status === "ready" && products.length === 0 && (
                    <p className="py-10 text-center text-slate-500">
                        Belum ada produk. Klik Tambah Produk untuk memulai.
                    </p>
                )}

                {status === "ready" &&
                    products.length > 0 &&
                    visible.length === 0 && (
                        <p className="py-10 text-center text-slate-500">
                            Tidak ada produk yang cocok dengan pencarian.
                        </p>
                    )}

                {status === "ready" && visible.length > 0 && (
                    <ProductGrid
                        products={visible}
                        onEdit={(product) => {
                            setMessage("")
                            setDialog({ type: "edit", product })
                        }}
                        onDelete={(product) => {
                            setMessage("")
                            setDialog({ type: "delete", product })
                        }}
                    />
                )}
            </section>

            {status === "ready" && (
                <p className="mt-6 text-xs text-slate-500">
                    Menampilkan {visible.length} dari {products.length} produk
                </p>
            )}

            {dialog?.type === "add" && (
                <Modal title="Tambah Produk" onClose={closeDialog}>
                    <ProductForm onSubmit={handleAdd} onCancel={closeDialog} />
                </Modal>
            )}
            {dialog?.type === "edit" && (
                <Modal title="Edit Produk" onClose={closeDialog}>
                    <ProductForm
                        product={dialog.product}
                        onSubmit={(values) =>
                            handleEdit(dialog.product.id, values)
                        }
                        onCancel={closeDialog}
                    />
                </Modal>
            )}
            {dialog?.type === "delete" && (
                <Modal title="Hapus Produk?" onClose={closeDialog}>
                    <DeleteConfirmDialog
                        product={dialog.product}
                        onConfirm={() => handleDelete(dialog.product)}
                        onCancel={closeDialog}
                    />
                </Modal>
            )}
        </>
    )
}
