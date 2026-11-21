import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

type Product = { id: number; name: string; price: number }

// API tiruan yang mengikuti kontrak backend Express:
// GET/POST /products, GET/PUT/DELETE /products/:id; error berbentuk { message }.
async function mockApi(
    page: Page,
    initial: Product[],
    options = { down: false },
) {
    const rows = [...initial]
    let nextId = Math.max(0, ...rows.map((r) => r.id)) + 1

    await page.route(/\/api\/products(\/[^/]+)?$/, async (route) => {
        const request = route.request()
        const match = new URL(request.url()).pathname.match(
            /\/products\/?(.*)$/,
        )
        const idText = match?.[1] ?? ""
        const id = Number(idText)
        const found = rows.find((r) => r.id === id)
        const notFound = {
            status: 404,
            json: { message: "Produk tidak ditemukan" },
        }

        if (options.down)
            return route.fulfill({
                status: 500,
                json: { message: "Terjadi kesalahan pada server" },
            })

        switch (request.method()) {
            case "GET":
                if (!idText) return route.fulfill({ json: rows })
                if (!Number.isInteger(id) || id <= 0)
                    return route.fulfill({
                        status: 400,
                        json: {
                            message: "id harus berupa bilangan bulat positif",
                        },
                    })
                return found
                    ? route.fulfill({ json: found })
                    : route.fulfill(notFound)
            case "POST": {
                const body = request.postDataJSON() as Omit<Product, "id">
                const created = { id: nextId++, ...body }
                rows.push(created)
                return route.fulfill({ status: 201, json: created })
            }
            case "PUT": {
                if (!found) return route.fulfill(notFound)
                Object.assign(found, request.postDataJSON())
                return route.fulfill({ json: found })
            }
            case "DELETE": {
                if (!found) return route.fulfill(notFound)
                rows.splice(rows.indexOf(found), 1)
                return route.fulfill({
                    json: { message: "Produk berhasil dihapus", data: found },
                })
            }
            default:
                return route.fallback()
        }
    })
    return rows
}

const seed: Product[] = [
    { id: 1, name: "Buku", price: 15000 },
    { id: 2, name: "Pulpen", price: 5000 },
]

test("daftar produk dimuat dari API dan '/' diarahkan ke /products", async ({
    page,
}) => {
    await mockApi(page, seed)
    await page.goto("/")
    await expect(page).toHaveURL(/\/products$/)
    await expect(
        page.getByRole("heading", { name: "Buku", level: 2 }),
    ).toBeVisible()
    await expect(page.getByText("Rp15.000")).toBeVisible()
    await expect(page.getByText("2 produk", { exact: true })).toBeVisible()
    await expect(page.getByText("Menampilkan 2 dari 2 produk")).toBeVisible()
})

test("pencarian memfilter nama produk dan menampilkan pesan kosong", async ({
    page,
}) => {
    await mockApi(page, seed)
    await page.goto("/products")
    await page.getByPlaceholder("Cari nama produk...").fill("pul")
    await expect(
        page.getByRole("heading", { name: "Pulpen", level: 2 }),
    ).toBeVisible()
    await expect(
        page.getByRole("heading", { name: "Buku", level: 2 }),
    ).toHaveCount(0)
    await expect(page.getByText("Menampilkan 1 dari 2 produk")).toBeVisible()
    await page.getByPlaceholder("Cari nama produk...").fill("zzz")
    await expect(page.getByText("Tidak ada produk yang cocok")).toBeVisible()
})

test("tambah produk: validasi lalu tersimpan lewat POST", async ({ page }) => {
    const rows = await mockApi(page, seed)
    await page.goto("/products")
    await page.getByRole("button", { name: "Tambah Produk" }).click()
    const dialog = page.getByRole("dialog", { name: "Tambah Produk" })

    await dialog.getByRole("button", { name: "Simpan Produk" }).click()
    await expect(dialog.getByText("Nama produk wajib diisi.")).toBeVisible()
    await expect(dialog.getByText("Harga harus lebih dari 0.")).toBeVisible()
    expect(rows).toHaveLength(2)

    await dialog.getByLabel("Nama Produk").fill("Spidol")
    await dialog.getByLabel("Harga (Rp)").fill("0")
    await dialog.getByRole("button", { name: "Simpan Produk" }).click()
    await expect(dialog.getByText("Harga harus lebih dari 0.")).toBeVisible()

    await dialog.getByLabel("Harga (Rp)").fill("8000")
    await dialog.getByRole("button", { name: "Simpan Produk" }).click()
    await expect(dialog).toHaveCount(0)
    await expect(
        page.getByRole("heading", { name: "Spidol", level: 2 }),
    ).toBeVisible()
    await expect(
        page.getByText('Produk "Spidol" berhasil ditambahkan.'),
    ).toBeVisible()
    expect(rows.at(-1)).toEqual({ id: 3, name: "Spidol", price: 8000 })
})

test("edit produk mengirim PUT dan memperbarui kartu", async ({ page }) => {
    const rows = await mockApi(page, seed)
    await page.goto("/products")
    await page
        .getByRole("article")
        .filter({ hasText: "Buku" })
        .getByRole("button", { name: "Edit" })
        .click()
    const dialog = page.getByRole("dialog", { name: "Edit Produk" })
    await expect(dialog.getByLabel("Nama Produk")).toHaveValue("Buku")
    await dialog.getByLabel("Harga (Rp)").fill("17000")
    await dialog.getByRole("button", { name: "Simpan Perubahan" }).click()
    await expect(page.getByText("Rp17.000")).toBeVisible()
    expect(rows[0].price).toBe(17000)
})

test("hapus produk: Batal tidak menghapus, konfirmasi mengirim DELETE", async ({
    page,
}) => {
    const rows = await mockApi(page, seed)
    await page.goto("/products")
    const card = page.getByRole("article").filter({ hasText: "Pulpen" })

    await card.getByRole("button", { name: "Hapus" }).click()
    const dialog = page.getByRole("dialog", { name: "Hapus Produk?" })
    await dialog.getByRole("button", { name: "Batal" }).click()
    await expect(dialog).toHaveCount(0)
    expect(rows).toHaveLength(2)

    await card.getByRole("button", { name: "Hapus" }).click()
    await dialog.getByRole("button", { name: "Hapus Produk" }).click()
    await expect(
        page.getByRole("heading", { name: "Pulpen", level: 2 }),
    ).toHaveCount(0)
    expect(rows).toHaveLength(1)
})

test("Escape menutup pop-up tanpa mengubah data", async ({ page }) => {
    const rows = await mockApi(page, seed)
    await page.goto("/products")
    await page.getByRole("button", { name: "Tambah Produk" }).click()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toHaveCount(0)
    expect(rows).toHaveLength(2)
})

test("klik produk membuka halaman detail dan Link kembali ke daftar", async ({
    page,
}) => {
    await mockApi(page, seed)
    await page.goto("/products")
    await page.getByRole("link", { name: "Pulpen" }).click()
    await expect(page).toHaveURL(/\/products\/2$/)
    await expect(
        page.getByRole("heading", { name: "Pulpen", level: 1 }),
    ).toBeVisible()
    await expect(page.getByText("Rp5.000")).toBeVisible()
    await page.getByRole("link", { name: "Kembali ke daftar produk" }).click()
    await expect(page).toHaveURL(/\/products$/)
})

test("detail produk yang tidak ada menampilkan pesan jelas", async ({
    page,
}) => {
    await mockApi(page, seed)
    for (const id of ["999", "abc"]) {
        await page.goto(`/products/${id}`)
        await expect(
            page.getByRole("heading", { name: "Produk tidak ditemukan" }),
        ).toBeVisible()
        await expect(
            page.getByRole("link", { name: "Kembali ke daftar produk" }),
        ).toBeVisible()
    }
})

test("URL tidak terdaftar menampilkan 404 dengan tautan pemulihan", async ({
    page,
}) => {
    await mockApi(page, seed)
    await page.goto("/halaman-tidak-ada")
    await expect(
        page.getByRole("heading", { name: "Halaman tidak ditemukan" }),
    ).toBeVisible()
    await page.getByRole("link", { name: "Lihat daftar produk" }).click()
    await expect(page).toHaveURL(/\/products$/)
    await page.goto("/halaman-tidak-ada")
    await page.getByRole("link", { name: "Kembali ke halaman utama" }).click()
    await expect(page).toHaveURL(/\/products$/)
})

test("kegagalan API menampilkan pesan error", async ({ page }) => {
    await mockApi(page, seed, { down: true })
    await page.goto("/products")
    await expect(page.getByRole("alert")).toContainText(
        "Terjadi kesalahan pada server",
    )
    await expect(page.getByRole("button", { name: "Coba lagi" })).toBeVisible()
})

test("tata letak responsif: tidak ada scroll horizontal di layar ponsel", async ({
    page,
}) => {
    await mockApi(page, seed)
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto("/products")
    await expect(
        page.getByRole("heading", { name: "Buku", level: 2 }),
    ).toBeVisible()
    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(overflow).toBe(false)
})
