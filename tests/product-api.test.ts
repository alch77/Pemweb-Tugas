import { test } from "node:test"
import assert from "node:assert/strict"
import ApiError from "../src/data/api-error.ts"
import ProductModel from "../src/data/product/model/product-model.ts"
import ProductInputParam from "../src/data/product/param/product-input-param.ts"
import ProductRemote from "../src/data/product/source/product-remote.ts"
import ProductRepository from "../src/data/product/repository/product-repository.ts"

const sample = { id: 1, name: " Pulpen ", price: 5000 }
const BASE = "http://api.example.test"

type Call = { url: string; init?: RequestInit }

// Membuat source dengan fetch palsu yang mencatat setiap request.
function setup(respond: (call: Call) => Response) {
    const calls: Call[] = []
    const source = ProductRemote({
        baseUrl: BASE + "/",
        fetchImpl: async (input, init) => {
            const call = { url: String(input), init }
            calls.push(call)
            return respond(call)
        },
    })
    return { calls, source, repository: ProductRepository(source) }
}

test("model memetakan response ke produk UI tanpa field tambahan", () => {
    const model = ProductModel.fromResponse({ ...sample, extra: "ignored" })
    assert.deepEqual(model.toJSON(), { id: 1, name: "Pulpen", price: 5000 })
})

test("model menerima harga 0 (backend mengizinkan >= 0)", () => {
    assert.equal(
        ProductModel.fromResponse({ ...sample, price: 0 }).getPrice(),
        0,
    )
})

test("model menolak data API yang melanggar kontrak produk", () => {
    for (const data of [
        null,
        {},
        { ...sample, id: 0 },
        { ...sample, name: " " },
        { ...sample, price: "5000" },
        { ...sample, price: -1 },
        { ...sample, price: 1.5 },
        { ...sample, price: Infinity },
    ]) {
        assert.throws(() => ProductModel.fromResponse(data), TypeError)
    }
})

test("parameter input memangkas nama dan menolak nilai tidak valid", () => {
    assert.deepEqual(
        new ProductInputParam({ name: "  Buku ", price: 12000 }).toJSON(),
        { name: "Buku", price: 12000 },
    )
    for (const values of [
        { name: " ", price: 1 },
        { name: "A", price: 0 },
        { name: "A", price: -1 },
        { name: "A", price: 1.5 },
    ]) {
        assert.throws(() => new ProductInputParam(values), TypeError)
    }
})

test("GET /products memetakan array ke model", async () => {
    const { calls, repository } = setup(() => Response.json([sample]))
    const models = await repository.getProductList()
    assert.equal(calls[0].url, `${BASE}/products`)
    assert.equal(calls[0].init?.method, "GET")
    assert.ok(models[0] instanceof ProductModel)
    assert.equal(models[0].getName(), "Pulpen")
})

test("GET /products/:id mengambil satu produk", async () => {
    const { calls, repository } = setup(() => Response.json(sample))
    const model = await repository.getProduct(1)
    assert.equal(calls[0].url, `${BASE}/products/1`)
    assert.equal(model.getId(), 1)
})

test("POST /products mengirim JSON name dan price", async () => {
    const { calls, repository } = setup(() =>
        Response.json({ id: 3, name: "Spidol", price: 8000 }, { status: 201 }),
    )
    const model = await repository.createProduct(
        new ProductInputParam({ name: "Spidol", price: 8000 }),
    )
    assert.equal(calls[0].init?.method, "POST")
    assert.deepEqual(JSON.parse(String(calls[0].init?.body)), {
        name: "Spidol",
        price: 8000,
    })
    assert.equal(
        new Headers(calls[0].init?.headers).get("Content-Type"),
        "application/json",
    )
    assert.equal(model.getId(), 3)
})

test("PUT /products/:id memperbarui produk", async () => {
    const { calls, repository } = setup(() =>
        Response.json({ id: 2, name: "Buku Tulis", price: 13000 }),
    )
    const model = await repository.updateProduct(
        2,
        new ProductInputParam({ name: "Buku Tulis", price: 13000 }),
    )
    assert.equal(calls[0].url, `${BASE}/products/2`)
    assert.equal(calls[0].init?.method, "PUT")
    assert.equal(model.getPrice(), 13000)
})

test("DELETE /products/:id tidak mengirim body", async () => {
    const { calls, repository } = setup(() =>
        Response.json({ message: "Produk berhasil dihapus", data: sample }),
    )
    await repository.deleteProduct(1)
    assert.equal(calls[0].url, `${BASE}/products/1`)
    assert.equal(calls[0].init?.method, "DELETE")
    assert.equal(calls[0].init?.body, undefined)
})

test("error 404 membawa status dan pesan dari backend", async () => {
    const { repository } = setup(() =>
        Response.json({ message: "Produk tidak ditemukan" }, { status: 404 }),
    )
    await assert.rejects(repository.getProduct(99), (error: unknown) => {
        assert.ok(error instanceof ApiError)
        assert.equal(error.status, 404)
        assert.equal(error.isNotFound, true)
        assert.equal(error.message, "Produk tidak ditemukan")
        return true
    })
})

test("error tanpa body JSON memakai pesan umum", async () => {
    const { repository } = setup(() => new Response("boom", { status: 500 }))
    await assert.rejects(repository.getProductList(), /HTTP 500/)
})

test("server tidak terjangkau menghasilkan ApiError status 0", async () => {
    const source = ProductRemote({
        baseUrl: BASE,
        fetchImpl: async () => {
            throw new TypeError("fetch failed")
        },
    })
    await assert.rejects(source.getProductListRemote(), (error: unknown) => {
        assert.ok(error instanceof ApiError)
        assert.equal(error.status, 0)
        return true
    })
})

test("tanpa base URL tidak ada request HTTP", async () => {
    let called = false
    const source = ProductRemote({
        fetchImpl: async () => {
            called = true
            return new Response()
        },
    })
    await assert.rejects(source.getProductListRemote(), /VITE_API_BASE_URL/)
    assert.equal(called, false)
})

test("repository menolak wrapper dan ID duplikat", async () => {
    const noop = async () => ({})
    const make = (response: unknown) =>
        ProductRepository({
            getProductListRemote: async () => response,
            getProductRemote: noop,
            createProductRemote: noop,
            updateProductRemote: noop,
            deleteProductRemote: noop,
        })
    assert.deepEqual(await make([]).getProductList(), [])
    for (const response of [{ data: [sample] }, [sample, sample]]) {
        await assert.rejects(make(response).getProductList(), TypeError)
    }
})
