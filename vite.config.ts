import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Generate static HTML files for each route
const generateStaticFiles = () => {
  const routes = [
    '/features',
    '/about',
    '/privacy',
    '/terms',
    '/faq',
    '/404'  // Add 404 page to static generation
  ];

  routes.forEach(route => {
    const dir = path.join('dist', route);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync('dist/index.html', path.join(dir, 'index.html'));
  });
};

// Generate sitemap.xml
const generateSitemap = () => {
  const baseUrl = 'https://snapmails.xyz';
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/features', priority: '0.8', changefreq: 'weekly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.6', changefreq: 'monthly' },
    { url: '/terms', priority: '0.6', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'weekly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync('dist/sitemap.xml', sitemap);
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-static-files',
      closeBundle() {
        generateStaticFiles();
        generateSitemap();
      },
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
          utils: ['./src/lib/guerrilla.ts', './src/lib/words.ts']
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    sourcemap: false,
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true
    }
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    },
    compression: true
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    },
    compression: true
  }
});