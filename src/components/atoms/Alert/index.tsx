import type { ReactNode } from "react"

const tones = {
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-green-200 bg-green-50 text-green-700",
}

type AlertProps = { tone?: keyof typeof tones; children: ReactNode }

export default function Alert({ tone = "error", children }: AlertProps) {
    return (
        <p
            role={tone === "error" ? "alert" : "status"}
            className={`rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}
        >
            {children}
        </p>
    )
}
