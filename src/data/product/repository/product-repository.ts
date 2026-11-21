import type { ProductRemoteSource } from "../source/product-remote.ts"
import ProductModel from "../model/product-model.ts"
import ProductInputParam from "../param/product-input-param.ts"

// Memetakan payload remote menjadi model aplikasi yang sudah tervalidasi.
export default function ProductRepository(source: ProductRemoteSource) {
    async function getProductList(): Promise<ProductModel[]> {
        const response = await source.getProductListRemote()
        // Kontrak backend: GET /products mengembalikan array produk langsung.
        if (!Array.isArray(response)) {
            throw new TypeError("Response API harus berupa array produk.")
        }

        const products = response.map((item) => ProductModel.fromResponse(item))
        const ids = products.map((product) => product.getId())
        if (new Set(ids).size !== ids.length) {
            throw new TypeError("ID produk dari API harus unik.")
        }
        return products
    }

    async function getProduct(id: number): Promise<ProductModel> {
        return ProductModel.fromResponse(await source.getProductRemote(id))
    }

    async function createProduct(param: ProductInputParam) {
        return ProductModel.fromResponse(
            await source.createProductRemote(param),
        )
    }

    async function updateProduct(id: number, param: ProductInputParam) {
        return ProductModel.fromResponse(
            await source.updateProductRemote(id, param),
        )
    }

    async function deleteProduct(id: number): Promise<void> {
        // Backend membalas { message, data }; isinya tidak diperlukan UI.
        await source.deleteProductRemote(id)
    }

    return {
        getProductList,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
    }
}

export type ProductRepositoryType = ReturnType<typeof ProductRepository>
