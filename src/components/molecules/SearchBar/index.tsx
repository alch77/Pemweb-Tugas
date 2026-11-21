import { TbSearch } from "react-icons/tb"

type SearchBarProps = { value: string; onChange: (value: string) => void }

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <label className="flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-500 sm:max-w-sm">
            <TbSearch className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Cari nama produk</span>
            <input
                type="search"
                placeholder="Cari nama produk..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
        </label>
    )
}
