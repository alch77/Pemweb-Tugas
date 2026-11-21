import { Link } from "react-router"
import { TbCompass } from "react-icons/tb"

export default function NotFoundPage() {
    return (
        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <TbCompass
                className="mx-auto size-12 text-blue-600"
                aria-hidden="true"
            />
            <p className="mt-3 text-sm font-bold text-blue-600">404</p>
            <h1 className="mt-1 text-2xl font-extrabold">
                Halaman tidak ditemukan
            </h1>
            <p className="mt-2 text-slate-500">
                Alamat yang Anda buka tidak terdaftar atau sudah dipindahkan.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <Link
                    to="/"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Kembali ke halaman utama
                </Link>
                <Link
                    to="/products"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                    Lihat daftar produk
                </Link>
            </div>
        </div>
    )
}
