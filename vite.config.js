import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: "/",
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: process.env.APP_ENV === 'production' ? false : true, // প্রোডাকশনে refresh অক্ষম
        }),
        react(),
    ],
    optimizeDeps: {
        include: ['jquery', 'datatables.net', 'datatables.net-dt'],
    },
});
