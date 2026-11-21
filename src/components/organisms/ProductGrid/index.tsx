import type { Product } from "../../../types/product"
import ProductCard from "../../molecules/ProductCard"

type ProductGridProps = {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export default function ProductGrid({
    products,
    onEdit,
    onDelete,
}: ProductGridProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
