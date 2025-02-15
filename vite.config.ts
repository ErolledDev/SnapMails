import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';

// Generate static HTML files for each route
const generateStaticFiles = () => {
  const routes = [
    '/features',
    '/about',
    '/privacy',
    '/terms',
    '/faq',
    '/404'
  ];

  routes.forEach(route => {
    const dir = path.join('dist', route);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync('dist/index.html', path.join(dir, 'index.html'));
  });
};

// Generate sitemap.xml with enhanced metadata
const generateSitemap = () => {
  const baseUrl = 'https://snapmails.xyz';
  const currentDate = new Date().toISOString();
  
  const pages = [
    { 
      url: '/',
      priority: '1.0',
      changefreq: 'daily',
      lastmod: currentDate
    },
    { 
      url: '/features',
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: currentDate
    },
    { 
      url: '/about',
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    { 
      url: '/privacy',
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    { 
      url: '/terms',
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    { 
      url: '/faq',
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: currentDate
    }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync('dist/sitemap.xml', sitemap);
};

// Generate robots.txt
const generateRobotsTxt = () => {
  const robotsTxt = `# robots.txt for SnapMails
User-agent: *
Allow: /
Allow: /features
Allow: /about
Allow: /privacy
Allow: /terms
Allow: /faq

# Block access to API endpoints and sensitive directories
Disallow: /api/
Disallow: /.git/
Disallow: /node_modules/
Disallow: /.env
Disallow: /.env.*

# Crawl delay to prevent server overload
Crawl-delay: 10

# Sitemap location
Sitemap: https://snapmails.xyz/sitemap.xml`;

  fs.writeFileSync('dist/robots.txt', robotsTxt);
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'SnapMails',
        short_name: 'SnapMails',
        description: 'Secure & Customizable Disposable Email Service',
        theme_color: '#3B82F6',
        background_color: '#ffffff',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.guerrillamail\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              networkTimeoutSeconds: 10
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true
      }
    }),
    compression({
      algorithm: 'brotli',
      ext: '.br'
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false
    }),
    {
      name: 'generate-static-files',
      closeBundle() {
        generateStaticFiles();
        generateSitemap();
        generateRobotsTxt();
      },
    }
  ],
  server: {
    proxy: {
      '/api/guerrillamail': {
        target: 'https://api.guerrillamail.com/ajax.php',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/guerrillamail/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Origin', 'https://snapmails.xyz');
          });
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
          utils: ['./src/lib/guerrilla.ts', './src/lib/words.ts'],
          features: ['./src/pages/Features.tsx'],
          about: ['./src/pages/About.tsx'],
          privacy: ['./src/pages/Privacy.tsx'],
          terms: ['./src/pages/Terms.tsx'],
          faq: ['./src/pages/FAQ.tsx']
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false
  }
});