import ApiError from "../../api-error.ts"
import ProductInputParam from "../param/product-input-param.ts"

export type ProductRemoteSource = {
    getProductListRemote: () => Promise<unknown>
    getProductRemote: (id: number) => Promise<unknown>
    createProductRemote: (param: ProductInputParam) => Promise<unknown>
    updateProductRemote: (
        id: number,
        param: ProductInputParam,
    ) => Promise<unknown>
    deleteProductRemote: (id: number) => Promise<unknown>
}

type ProductRemoteOptions = {
    baseUrl?: string
    fetchImpl?: typeof fetch
}

// Mengirim request HTTP dan mengembalikan JSON mentah (belum divalidasi).
export default function ProductRemote({
    baseUrl = "",
    fetchImpl = (...args) => fetch(...args),
}: ProductRemoteOptions = {}): ProductRemoteSource {
    async function request(
        path: string,
        method: "GET" | "POST" | "PUT" | "DELETE",
        body?: unknown,
    ): Promise<unknown> {
        if (!baseUrl.trim()) {
            throw new Error(
                "Isi VITE_API_BASE_URL di .env.local terlebih dahulu.",
            )
        }

        const headers: Record<string, string> = {
            Accept: "application/json",
        }
        if (body !== undefined) headers["Content-Type"] = "application/json"

        let response: Response
        try {
            response = await fetchImpl(
                `${baseUrl.replace(/\/+$/, "")}${path}`,
                {
                    method,
                    headers,
                    body: body === undefined ? undefined : JSON.stringify(body),
                },
            )
        } catch {
            throw new ApiError(
                0,
                "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.",
            )
        }

        if (!response.ok) {
            throw new ApiError(
                response.status,
                await readErrorMessage(response),
            )
        }
        return response.json()
    }

    return {
        getProductListRemote: () => request("/products", "GET"),
        getProductRemote: (id) => request(`/products/${id}`, "GET"),
        createProductRemote: (param) =>
            request("/products", "POST", param.toJSON()),
        updateProductRemote: (id, param) =>
            request(`/products/${id}`, "PUT", param.toJSON()),
        deleteProductRemote: (id) => request(`/products/${id}`, "DELETE"),
    }
}

// Backend mengirim { message } pada error. Jika tidak ada, pakai pesan umum.
async function readErrorMessage(response: Response): Promise<string> {
    try {
        const data: unknown = await response.json()
        if (
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof data.message === "string" &&
            data.message
        ) {
            return data.message
        }
    } catch {
        // Body bukan JSON; gunakan pesan umum di bawah.
    }
    return `Permintaan gagal (HTTP ${response.status}).`
}
