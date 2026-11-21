import { Route, Routes } from "react-router"
import PageLayout from "../src/components/templates/PageLayout"
import RootPage from "./page"
import ProductsPage from "./products/page"
import ProductDetailPage from "./products/detail/page"
import NotFoundPage from "./not-found/page"

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PageLayout />}>
                <Route index element={<RootPage />} />
                <Route path="products">
                    <Route index element={<ProductsPage />} />
                    <Route path=":id" element={<ProductDetailPage />} />
                </Route>
                {/* URL yang tidak terdaftar */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}
