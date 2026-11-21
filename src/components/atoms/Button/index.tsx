import type { ButtonHTMLAttributes } from "react"

const variants = {
    primary:
        "border-blue-600 bg-blue-600 text-white shadow-sm hover:border-blue-700 hover:bg-blue-700",
    outline: "border-blue-600 bg-white text-blue-600 hover:bg-blue-50",
    danger: "border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700",
    outlineDanger: "border-red-500 bg-white text-red-600 hover:bg-red-50",
}

const sizes = {
    md: "min-h-11 px-4 py-2.5 text-sm",
    sm: "min-h-9 px-3 py-1.5 text-xs",
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants
    size?: keyof typeof sizes
}

export default function Button({
    variant = "primary",
    size = "md",
    className = "",
    type = "button",
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
