import type { Product } from "../../../types/product"

// Memvalidasi response API dan menyediakan data produk untuk antarmuka.
export default class ProductModel {
    private readonly id: number
    private readonly name: string
    private readonly price: number

    constructor({ id, name, price }: Product) {
        this.id = id
        this.name = name
        this.price = price
    }

    getId(): number {
        return this.id
    }
    getName(): string {
        return this.name
    }
    getPrice(): number {
        return this.price
    }
    toJSON(): Product {
        return { id: this.id, name: this.name, price: this.price }
    }

    static fromResponse(data: unknown): ProductModel {
        if (typeof data !== "object" || data === null) {
            throw new TypeError("Format produk dari API tidak valid.")
        }
        const record = data as Record<string, unknown>
        if (
            typeof record.id !== "number" ||
            !Number.isSafeInteger(record.id) ||
            record.id <= 0 ||
            typeof record.name !== "string" ||
            !record.name.trim() ||
            typeof record.price !== "number" ||
            !Number.isSafeInteger(record.price) ||
            // Backend menerima harga >= 0.
            record.price < 0
        ) {
            throw new TypeError("Format produk dari API tidak valid.")
        }
        return new ProductModel({
            id: record.id,
            name: record.name.trim(),
            price: record.price,
        })
    }
}
