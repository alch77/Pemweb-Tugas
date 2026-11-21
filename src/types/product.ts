export interface Product {
    id: number
    name: string
    price: number
}

// Data yang dikirim ke backend saat menambah atau mengubah produk.
export type ProductValues = Omit<Product, "id">
