import { useCallback, useEffect, useState } from "react"
import type { Product, ProductValues } from "../types/product"
import { productRepository } from "../data/product"
import ProductInputParam from "../data/product/param/product-input-param.ts"

type Status = "loading" | "ready" | "error"

function toMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback
}

// Mengelola daftar produk dari backend. Semua perubahan dikirim lewat API,
// lalu state diperbarui dengan data yang dikembalikan server.
export function useProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [status, setStatus] = useState<Status>("loading")
    const [error, setError] = useState("")

    useEffect(() => {
        let cancelled = false
        productRepository
            .getProductList()
            .then((models) => {
                if (cancelled) return
                setProducts(models.map((model) => model.toJSON()))
                setStatus("ready")
            })
            .catch((e: unknown) => {
                if (cancelled) return
                setError(toMessage(e, "Gagal memuat produk."))
                setStatus("error")
            })
        return () => {
            cancelled = true
        }
    }, [])

    const reload = useCallback(async () => {
        setStatus("loading")
        setError("")
        try {
            const models = await productRepository.getProductList()
            setProducts(models.map((model) => model.toJSON()))
            setStatus("ready")
        } catch (e) {
            setError(toMessage(e, "Gagal memuat produk."))
            setStatus("error")
        }
    }, [])

    // Fungsi di bawah melempar error agar formulir/dialog dapat menampilkannya.
    const addProduct = useCallback(async (values: ProductValues) => {
        const created = await productRepository.createProduct(
            new ProductInputParam(values),
        )
        setProducts((current) => [...current, created.toJSON()])
    }, [])

    const editProduct = useCallback(
        async (id: number, values: ProductValues) => {
            const updated = await productRepository.updateProduct(
                id,
                new ProductInputParam(values),
            )
            setProducts((current) =>
                current.map((p) => (p.id === id ? updated.toJSON() : p)),
            )
        },
        [],
    )

    const removeProduct = useCallback(async (id: number) => {
        await productRepository.deleteProduct(id)
        setProducts((current) => current.filter((p) => p.id !== id))
    }, [])

    return {
        products,
        status,
        error,
        reload,
        addProduct,
        editProduct,
        removeProduct,
    }
}
