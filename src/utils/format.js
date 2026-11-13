// Format angka menjadi Rupiah, contoh: 5000 -> "Rp5.000"
export function formatRupiah(angka) {
  return 'Rp' + Number(angka).toLocaleString('id-ID')
}
