import type { Product } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"

export default function ProductDetail({ product }: { product: Product }) {
    return (
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">
                ID: {product.id}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">{product.name}</h1>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <dt className="text-sm text-slate-500">Nama produk</dt>
                    <dd className="font-semibold">{product.name}</dd>
                </div>
                <div>
                    <dt className="text-sm text-slate-500">Harga</dt>
                    <dd className="text-xl font-extrabold text-blue-600">
                        {formatRupiah(product.price)}
                    </dd>
                </div>
            </dl>
        </article>
    )
}
