import ProductRemote from "./source/product-remote.ts"
import ProductRepository from "./repository/product-repository.ts"

// Satu instance repository yang dipakai seluruh aplikasi.
// "/api" diteruskan oleh proxy Vite ke backend (lihat vite.config.ts).
export const productRepository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api" }),
)
