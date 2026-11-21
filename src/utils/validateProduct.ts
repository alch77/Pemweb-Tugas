export type ProductFormErrors = { name?: string; price?: string }

// Validasi isian formulir (nilai masih berupa teks). Aturan harga mengikuti
// desain: harus lebih dari 0. Backend menerima bilangan bulat >= 0.
export function validateProductForm(
    name: string,
    price: string,
): ProductFormErrors {
    const errors: ProductFormErrors = {}
    if (!name.trim()) errors.name = "Nama produk wajib diisi."

    const value = Number(price)
    if (price.trim() === "" || !Number.isFinite(value) || value <= 0) {
        errors.price = "Harga harus lebih dari 0."
    } else if (!Number.isSafeInteger(value)) {
        errors.price = "Harga harus berupa bilangan bulat."
    }
    return errors
}
