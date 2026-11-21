import { Link, NavLink } from "react-router"
import { TbPackage } from "react-icons/tb"

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
        isActive
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:bg-slate-100"
    }`

export default function NavBar() {
    return (
        <header className="border-b border-slate-200 bg-white">
            <nav
                aria-label="Navigasi utama"
                className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
            >
                <Link
                    to="/"
                    className="flex items-center gap-2 text-base font-extrabold text-slate-900"
                >
                    <TbPackage
                        className="size-6 text-blue-600"
                        aria-hidden="true"
                    />
                    Manajemen Produk
                </Link>
                <div className="flex gap-1">
                    <NavLink to="/products" className={linkClass}>
                        Produk
                    </NavLink>
                </div>
            </nav>
        </header>
    )
}
