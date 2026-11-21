const number = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 })

// Contoh: 5000 -> "Rp5.000" (tanpa spasi, sesuai desain).
export function formatRupiah(price: number) {
    return `Rp${number.format(price)}`
}
