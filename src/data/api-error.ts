// Error dari API. `status` berisi kode HTTP, atau 0 jika server tidak terjangkau.
export default class ApiError extends Error {
    readonly status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = "ApiError"
        this.status = status
    }

    get isNotFound(): boolean {
        return this.status === 404
    }
}
