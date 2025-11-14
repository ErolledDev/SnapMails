import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Mail,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import EmailBox from './components/EmailBox';
import AdUnit from './components/AdUnit';


// Lazy load components
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const About = lazy(() => import('./pages/About'));
const Features = lazy(() => import('./pages/Features'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PWAPrompt = lazy(() => import('./components/PWAPrompt'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-900 animate-spin"></div>
      <div className="w-12 h-12 rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin absolute top-0"></div>
    </div>
  </div>
);

const FallbackError = () => (
  <div className="flex items-center justify-center min-h-[400px] text-center p-4">
    <div>
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Please try refreshing the page
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

const Home: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="overflow-x-hidden">
        <Helmet>
          <title>Free Temporary Email - Disposable Temp Mail Service | SnapMails</title>
          <meta name="description" content="Create instant disposable email addresses with SnapMails. Protect your privacy with our secure temporary email service. No registration required, custom domains available." />
          <meta name="keywords" content="temporary email, disposable email, temp mail, anonymous email, spam protection, custom email, temporary mail service, secure email, free temp mail" />
          <link rel="canonical" href="https://snapmails.xyz" />

          <meta property="og:title" content="Free Temporary Email - Disposable Temp Mail Service | SnapMails" />
          <meta property="og:description" content="Create instant disposable email addresses with SnapMails. Protect your privacy with our secure temporary email service. No registration required, custom domains available." />
          <meta property="og:url" content="https://snapmails.xyz" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://snapmails.xyz/og-image.jpg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:site_name" content="SnapMails" />
          <meta property="og:locale" content="en_US" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Free Temporary Email - Disposable Temp Mail Service | SnapMails" />
          <meta name="twitter:description" content="Create instant disposable email addresses with SnapMails. Protect your privacy with our secure temporary email service." />
          <meta name="twitter:image" content="https://snapmails.xyz/twitter-image.jpg" />
          <meta name="twitter:site" content="@snapmails" />

          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="author" content="SnapMails" />
          <meta name="copyright" content="SnapMails" />
          <meta name="theme-color" content="#3B82F6" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="msapplication-TileColor" content="#3B82F6" />

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SnapMails",
              "description": "Create instant disposable email addresses with SnapMails. Protect your privacy with our secure temporary email service.",
              "url": "https://snapmails.xyz",
              "applicationCategory": "Email Service",
              "operatingSystem": "All",
              "browserRequirements": "Requires JavaScript",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Instant temporary email addresses",
                "Custom domain selection",
                "No registration required",
                "Real-time email notifications",
                "Secure and private"
              ],
              "screenshot": {
                "@type": "ImageObject",
                "url": "https://snapmails.xyz/desktop-view.jpg",
                "caption": "SnapMails desktop interface"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250",
                "bestRating": "5",
                "worstRating": "1"
              }
            })}
          </script>
        </Helmet>


        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdUnit
            slot="1234567890"
            format="auto"
            position="top"
            className="py-8 sm:py-12"
          />

          <div className="py-8 sm:py-12">
            <ErrorBoundary>
              <EmailBox />
            </ErrorBoundary>
          </div>

          <AdUnit
            slot="0987654321"
            format="auto"
            position="bottom"
            className="py-8 sm:py-12"
          />
        </main>
      </div>
    </ErrorBoundary>
  );
};


const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme');
        if (stored) return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return false;
    }
  });
  const location = useLocation();

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [isDark]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [location.pathname]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
        <header className="bg-white/80 dark:bg-gray-900/80 shadow-lg dark:shadow-gray-800/50 sticky top-0 z-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
                  SnapMails
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  to="/"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/features"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  )}
                </button>
              </nav>

              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  )}
                </button>
                <button
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/features"
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </div>
            </div>
          )}
        </header>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>

        <Suspense fallback={null}>
          <PWAPrompt />
        </Suspense>

        <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t dark:border-gray-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
                    SnapMails
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  Premium temporary email addresses for your privacy needs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Product
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/features"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Legal
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/privacy"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://www.guerrillamail.com"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      API
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Connect
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="mailto:erolledph@gmail.com"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t dark:border-gray-800 mt-8 pt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                © 2025 SnapMails. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'bg-white dark:bg-gray-800 dark:text-white',
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;