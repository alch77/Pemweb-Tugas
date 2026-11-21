import { useId } from "react"
import type { InputHTMLAttributes } from "react"
import Input from "../../atoms/Input"

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
    label: string
    hint?: string
    error?: string
}

// Label + input + petunjuk. Saat ada error, petunjuk diganti pesan berwarna merah.
export default function FormField({
    label,
    hint,
    error,
    ...inputProps
}: FormFieldProps) {
    const id = useId()
    const messageId = `${id}-message`
    const message = error ?? hint

    return (
        <div className="mb-4">
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-bold text-slate-800"
            >
                {label}
            </label>
            <Input
                id={id}
                invalid={Boolean(error)}
                aria-describedby={message ? messageId : undefined}
                {...inputProps}
            />
            {message && (
                <p
                    id={messageId}
                    className={`mt-1 text-xs ${error ? "text-red-600" : "text-slate-500"}`}
                >
                    {message}
                </p>
            )}
        </div>
    )
}
