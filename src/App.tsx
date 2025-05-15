import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Mail,
  Shield,
  Clock,
  Lock,
  Menu,
  X,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

// Lazy load components
const EmailBox = lazy(() => import('./components/EmailBox'));
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

const Home = () => {
  return (
    <ErrorBoundary>
      <div className="relative">
        <div className="text-center max-w-4xl mx-auto px-4 pt-20 pb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/50 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Premium Temporary Email Service</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600">
              Your Privacy Matters
            </h1>
            <p className="text-2xl font-medium text-gray-800 dark:text-gray-100 max-w-2xl mx-auto mb-6 leading-relaxed">
              Instant, Secure, and Customizable Temporary Email Service
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
              The only customizable temporary email service. Keep your real
              inbox clean and secure with instant disposable email addresses
              for temporary use.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center mt-12 mb-12">
            <div className="flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Privacy Protected</span>
            </div>
            <div className="flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Instant Access</span>
            </div>
            <div className="flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">No Registration</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <EmailBox />
          </Suspense>
        </ErrorBoundary>
      </main>
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
      <div className="min-h-screen bg-white dark:bg-gray-900">
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