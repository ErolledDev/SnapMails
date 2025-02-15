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

// Generate sitemap.xml with current date
const generateSitemap = () => {
  const baseUrl = 'https://snapmails.xyz';
  const currentDate = new Date().toISOString().split('T')[0];
  
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
    <lastmod>${currentDate}</lastmod>
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
Sitemap: https://snapmails.xyz/sitemap.xml

# Additional rules for specific bots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

# Block archive.org bot
User-agent: ia_archiver
Disallow: /

# Block potentially harmful bots
User-agent: Baiduspider
Disallow: /

User-agent: PetalBot
Disallow: /`;

  fs.writeFileSync('dist/robots.txt', robotsTxt);
};

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: ['@babel/preset-react'],
        plugins: []
      }
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
          utils: ['./src/lib/guerrilla.ts', './src/lib/words.ts'],
          // Separate route chunks
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
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    sourcemap: process.env.NODE_ENV === 'development',
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true
    },
    // Enable build cache
    cache: true,
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
      exclude: []
    }
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:;"
    },
    compression: true,
    // Enable HMR with overlay disabled for better performance
    hmr: {
      overlay: false
    }
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:;"
    },
    compression: true
  },
  // Add performance optimizations
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  }
});