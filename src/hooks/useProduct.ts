import { useEffect, useState } from "react"
import type { Product } from "../types/product"
import ApiError from "../data/api-error.ts"
import { productRepository } from "../data/product"

type Result =
    | { forId: number; status: "ready"; product: Product }
    | { forId: number; status: "not-found" }
    | { forId: number; status: "error"; message: string }

// Mengambil satu produk dari GET /products/:id. Hasil disimpan bersama id-nya,
// sehingga perpindahan antar-id otomatis kembali ke status "loading".
export function useProduct(id: number | null) {
    const [result, setResult] = useState<Result | null>(null)

    useEffect(() => {
        if (id === null) return
        let cancelled = false
        productRepository
            .getProduct(id)
            .then((model) => {
                if (cancelled) return
                setResult({
                    forId: id,
                    status: "ready",
                    product: model.toJSON(),
                })
            })
            .catch((e: unknown) => {
                if (cancelled) return
                if (
                    e instanceof ApiError &&
                    (e.isNotFound || e.status === 400)
                ) {
                    setResult({ forId: id, status: "not-found" })
                } else {
                    setResult({
                        forId: id,
                        status: "error",
                        message:
                            e instanceof Error
                                ? e.message
                                : "Gagal memuat produk.",
                    })
                }
            })
        return () => {
            cancelled = true
        }
    }, [id])

    // ID pada URL tidak valid (bukan bilangan bulat positif): tidak perlu request.
    if (id === null) return { status: "not-found" as const }
    if (result === null || result.forId !== id) {
        return { status: "loading" as const }
    }
    return result
}
