import { Outlet } from "react-router"
import NavBar from "../../organisms/NavBar"

export default function PageLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
                <Outlet />
            </main>
        </div>
    )
}
