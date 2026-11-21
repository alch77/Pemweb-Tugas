import { useState } from "react"
import type { FormEvent } from "react"
import type { Product, ProductValues } from "../../../types/product"
import { validateProductForm } from "../../../utils/validateProduct"
import type { ProductFormErrors } from "../../../utils/validateProduct"
import Alert from "../../atoms/Alert"
import Button from "../../atoms/Button"
import FormField from "../../molecules/FormField"

type ProductFormProps = {
    // Jika diisi, formulir berjalan dalam mode edit.
    product?: Product
    onSubmit: (values: ProductValues) => Promise<void>
    onCancel: () => void
}

export default function ProductForm({
    product,
    onSubmit,
    onCancel,
}: ProductFormProps) {
    const isEdit = product !== undefined
    const [name, setName] = useState(product?.name ?? "")
    const [price, setPrice] = useState(
        product !== undefined ? String(product.price) : "",
    )
    const [errors, setErrors] = useState<ProductFormErrors>({})
    const [submitError, setSubmitError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const found = validateProductForm(name, price)
        setErrors(found)
        setSubmitError("")
        if (found.name || found.price) return

        setIsSubmitting(true)
        try {
            await onSubmit({ name: name.trim(), price: Number(price) })
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Gagal menyimpan produk.",
            )
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 className="pr-8 text-2xl font-extrabold">
                {isEdit ? "Edit Produk" : "Tambah Produk"}
            </h2>
            <p className="mt-1 mb-4 text-sm text-slate-500">
                {isEdit
                    ? "Perbarui informasi produk yang dipilih."
                    : "Masukkan informasi produk baru."}
            </p>
            {isEdit && (
                <p className="-mt-2 mb-3 text-xs text-slate-500">
                    ID: {product.id}
                </p>
            )}

            <FormField
                label="Nama Produk"
                placeholder="Contoh: Pulpen"
                value={name}
                onChange={(event) => setName(event.target.value)}
                error={errors.name}
                disabled={isSubmitting}
                autoFocus
            />
            <FormField
                label="Harga (Rp)"
                type="number"
                inputMode="numeric"
                placeholder="Contoh: 5000"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                hint="Harga harus lebih dari 0."
                error={errors.price}
                disabled={isSubmitting}
            />

            {submitError && <Alert>{submitError}</Alert>}

            <div className="mt-5 flex gap-2.5">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Menyimpan…"
                        : isEdit
                          ? "Simpan Perubahan"
                          : "Simpan Produk"}
                </Button>
            </div>
        </form>
    )
}
