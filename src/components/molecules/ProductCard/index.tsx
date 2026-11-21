import { Link } from "react-router"
import type { Product } from "../../../types/product"
import Button from "../../atoms/Button"
import { formatRupiah } from "../../../utils/formatRupiah"

type ProductCardProps = {
    product: Product
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export default function ProductCard({
    product,
    onEdit,
    onDelete,
}: ProductCardProps) {
    return (
        <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">
                ID: {product.id}
            </span>
            <h2 className="mt-2 text-xl font-extrabold">
                <Link
                    to={`/products/${product.id}`}
                    className="hover:text-blue-700 hover:underline"
                >
                    {product.name}
                </Link>
            </h2>
            <p className="mb-1 text-xl font-extrabold text-blue-600">
                {formatRupiah(product.price)}
            </p>
            <Link
                to={`/products/${product.id}`}
                className="mb-4 w-fit text-sm font-medium text-blue-600 hover:underline"
            >
                Lihat detail →
            </Link>
            <div className="mt-auto flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(product)}
                >
                    Edit
                </Button>
                <Button
                    variant="outlineDanger"
                    size="sm"
                    className="flex-1"
                    onClick={() => onDelete(product)}
                >
                    Hapus
                </Button>
            </div>
        </article>
    )
}
