import { test } from "node:test"
import assert from "node:assert/strict"
import { validateProductForm } from "../src/utils/validateProduct.ts"

test("isian valid tidak menghasilkan error", () => {
    assert.deepEqual(validateProductForm("Pulpen", "5000"), {})
})

test("nama kosong atau spasi saja ditolak", () => {
    assert.ok(validateProductForm("", "5000").name)
    assert.ok(validateProductForm("   ", "5000").name)
})

test("harga kosong, 0, negatif, atau bukan angka ditolak", () => {
    for (const price of ["", " ", "0", "-5", "abc"]) {
        assert.ok(validateProductForm("Pulpen", price).price, price)
    }
})

test("harga desimal ditolak karena backend menerima bilangan bulat", () => {
    assert.ok(validateProductForm("Pulpen", "12.5").price)
})
