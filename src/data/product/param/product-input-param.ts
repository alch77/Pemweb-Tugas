import type { ProductValues } from "../../../types/product"

// Body untuk POST /products dan PUT /products/:id: { name, price }.
export default class ProductInputParam {
    private readonly name: string
    private readonly price: number

    constructor({ name, price }: ProductValues) {
        const trimmed = name.trim()
        if (!trimmed) throw new TypeError("Nama produk wajib diisi.")
        if (!Number.isSafeInteger(price) || price <= 0) {
            throw new TypeError("Harga harus bilangan bulat lebih dari 0.")
        }
        this.name = trimmed
        this.price = price
    }

    toJSON(): ProductValues {
        return { name: this.name, price: this.price }
    }
}
