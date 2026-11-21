# Manajemen Produk (React Router + Tailwind CSS + Backend Express)

Aplikasi manajemen produk dengan React, TypeScript, Vite, React Router, dan
Tailwind CSS. Seluruh data produk diambil dan disimpan melalui backend Express +
Prisma (SQLite) pada repository `ExpressDatabase_Albert_5027251034`.

## Fitur

| Halaman / fitur                                  | URL             |
| ------------------------------------------------ | --------------- |
| Daftar produk, pencarian, tambah, edit, hapus    | `/products`     |
| Detail produk (pesan jelas jika tidak ditemukan) | `/products/:id` |
| Halaman 404 untuk URL tidak terdaftar            | `*`             |

`/` diarahkan ke `/products`.

## Menjalankan backend

Prasyarat: Node.js 18+. Di folder backend:

```bash
npm install                        # sekaligus prisma generate
echo 'DATABASE_URL="file:./dev.db"' > .env
npx prisma migrate deploy          # membuat prisma/dev.db dan tabel Product
npm run db:seed                    # mengisi Buku dan Pulpen
npm start                          # http://localhost:3000
```

## Menjalankan frontend

Prasyarat: Node.js 22.12 atau lebih baru. Di folder ini, dengan backend sudah berjalan:

```bash
npm ci
cp .env.example .env.local         # opsional; default sudah sesuai
npm run dev                        # http://127.0.0.1:5173
```

Backend tidak mengaktifkan CORS, sehingga frontend memanggil `/api/*` dan Vite
meneruskannya ke `BACKEND_URL` (default `http://localhost:3000`) dengan awalan
`/api` dihapus (lihat `vite.config.ts`). Jika backend berjalan di port lain,
ubah `BACKEND_URL` di `.env.local`, lalu restart `npm run dev`.

## Kontrak API yang dipakai

| Operasi | Request                               | Respons                                  |
| ------- | ------------------------------------- | ---------------------------------------- |
| Daftar  | `GET /products`                       | `200` array `{ id, name, price }`        |
| Detail  | `GET /products/:id`                   | `200` objek produk, `404` jika tidak ada |
| Tambah  | `POST /products` `{ name, price }`    | `201` produk baru                        |
| Edit    | `PUT /products/:id` `{ name, price }` | `200` produk diperbarui                  |
| Hapus   | `DELETE /products/:id`                | `200` `{ message, data }`                |

## Perintah

```bash
npm run typecheck    # pemeriksaan tipe
npm run lint         # ESLint
npm test             # unit test (data layer dan validasi)
npm run build        # typecheck + build produksi
npx playwright install chromium   # sekali saja
npm run test:e2e     # tes browser dengan API tiruan
```

## Struktur

```text
app/                  entry, routes, pembungkus halaman
src/components/
  atoms/              Button, Input, Spinner, Alert
  molecules/          ProductCard, FormField, SearchBar, Modal
  organisms/          NavBar, ProductGrid, ProductForm, DeleteConfirmDialog, ProductDetail
  templates/          PageLayout (NavBar + Outlet)
  pages/              ProductsPage, ProductDetailPage, NotFoundPage, RootPage
src/data/product/     model, param, source (HTTP), repository
src/hooks/            useProducts, useProduct
bukti/                screenshot bukti pengujian
```
