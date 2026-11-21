import { defineConfig } from "@playwright/test"

// Tes browser memakai API tiruan (page.route) sehingga tidak membutuhkan backend.
// Browser: jalankan `npx playwright install chromium` sekali. Untuk memakai Google
// Chrome yang sudah terpasang, set PW_CHANNEL=chrome.
export default defineConfig({
    testDir: "./tests/browser",
    fullyParallel: true,
    use: {
        baseURL: "http://127.0.0.1:5173",
        browserName: "chromium",
        channel: process.env.PW_CHANNEL || undefined,
        viewport: { width: 1280, height: 900 },
    },
    webServer: {
        command: "npm run dev -- --port 5173 --strictPort",
        url: "http://127.0.0.1:5173",
        reuseExistingServer: false,
    },
})
