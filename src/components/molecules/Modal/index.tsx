import { useEffect } from "react"
import type { ReactNode } from "react"
import { TbX } from "react-icons/tb"

type ModalProps = { title: string; onClose: () => void; children: ReactNode }

// Pop-up: ditutup dengan tombol X, klik latar, atau tombol Escape.
export default function Modal({ title, onClose, children }: ModalProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose()
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/45 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative max-h-full w-full max-w-sm overflow-y-auto rounded-xl bg-white p-5 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup"
                    className="absolute top-3 right-3 cursor-pointer rounded-md p-1 text-slate-500 hover:bg-slate-100"
                >
                    <TbX className="size-5" aria-hidden="true" />
                </button>
                {children}
            </div>
        </div>
    )
}
