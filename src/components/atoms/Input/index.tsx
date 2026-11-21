import type { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }

export default function Input({
    invalid = false,
    className = "",
    ...props
}: InputProps) {
    return (
        <input
            aria-invalid={invalid || undefined}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 disabled:bg-slate-100 ${
                invalid ? "border-red-500" : "border-slate-300"
            } ${className}`}
            {...props}
        />
    )
}
