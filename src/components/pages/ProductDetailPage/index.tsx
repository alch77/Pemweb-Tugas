import { Link, useParams } from "react-router"
import { TbArrowLeft } from "react-icons/tb"
import { useProduct } from "../../../hooks/useProduct"
import Alert from "../../atoms/Alert"
import Spinner from "../../atoms/Spinner"
import ProductDetail from "../../organisms/ProductDetail"

// ID valid = bilangan bulat positif. Selain itu (mis. /products/abc) dianggap tidak ditemukan.
function parseId(value: string | undefined): number | null {
    if (value === undefined || !/^\d+$/.test(value)) return null
    const id = Number(value)
    return Number.isSafeInteger(id) && id > 0 ? id : null
}

export default function ProductDetailPage() {
    const { id: rawId } = useParams()
    const result = useProduct(parseId(rawId))

    return (
        <>
            <Link
                to="/products"
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
            >
                <TbArrowLeft className="size-4" aria-hidden="true" />
                Kembali ke daftar produk
            </Link>

            {result.status === "loading" && <Spinner label="Memuat produk…" />}

            {result.status === "ready" && (
                <ProductDetail product={result.product} />
            )}

            {result.status === "not-found" && (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-extrabold">
                        Produk tidak ditemukan
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Produk dengan ID{" "}
                        <span className="font-semibold">{rawId}</span> tidak ada
                        atau sudah dihapus.
                    </p>
                </div>
            )}

            {result.status === "error" && <Alert>{result.message}</Alert>}
        </>
    )
}
