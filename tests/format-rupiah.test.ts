import { test } from "node:test"
import assert from "node:assert/strict"
import { formatRupiah } from "../src/utils/formatRupiah.ts"

test("harga ditampilkan sebagai rupiah tanpa spasi dan pecahan", () => {
    assert.equal(formatRupiah(5000), "Rp5.000")
    assert.equal(formatRupiah(12000), "Rp12.000")
    assert.equal(formatRupiah(1250000), "Rp1.250.000")
    assert.equal(formatRupiah(0), "Rp0")
})
