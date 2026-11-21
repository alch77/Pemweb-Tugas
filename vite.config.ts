import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// Backend Express tidak mengaktifkan CORS. Selama development, request ke
// /api/* diteruskan oleh Vite ke backend sehingga browser menganggapnya satu origin.
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "")
    const target = env.BACKEND_URL || "http://localhost:3000"

    return {
        plugins: [react()],
        server: {
            proxy: {
                "/api": {
                    target,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    }
})
