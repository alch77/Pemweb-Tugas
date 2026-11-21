import { TbLoader2 } from "react-icons/tb"

export default function Spinner({ label = "Memuat…" }: { label?: string }) {
    return (
        <div
            role="status"
            className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500"
        >
            <TbLoader2 className="size-5 animate-spin" aria-hidden="true" />
            {label}
        </div>
    )
}
