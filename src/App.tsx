import React, { useState, useEffect, Suspense } from 'react';
import { Mail, Shield, Clock, Lock, Menu, X, Edit2, Moon, Sun } from 'lucide-react';
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import EmailBox from './components/EmailBox';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import About from './pages/About';
import Features from './pages/Features';
import NotFound from './pages/NotFound';
import FAQ from './pages/FAQ';
import PWAPrompt from './components/PWAPrompt';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h2>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const Home: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="relative">
        <div className="relative">
          <div className="text-center max-w-4xl mx-auto px-4 pt-16 pb-12">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-300">
                Your Privacy Matters!
              </h1>
              <p className="text-2xl font-medium text-gray-800 dark:text-gray-100 max-w-2xl mx-auto mb-6 leading-relaxed">
                Instant, Secure, and Customizable Temporary Email Service
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                The only customizable temporary email service. Keep your real inbox clean and secure with instant disposable email addresses for temporary use.
              </p>
             
            </div>
            <div className="flex flex-wrap gap-6 justify-center mt-12 mb-12">
              <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                <Shield className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                Privacy Protected
              </div>
              <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                <Clock className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                Instant Access
              </div>
              <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                <Lock className="w-5 h-5 text-blue-500 dark:text-blue-300 mr-2" />
                No Registration
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <EmailBox />
        </Suspense>

        <section id="features" className="py-16 relative overflow-hidden">
          <div className="relative">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Choose SnapMails?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Instant Access</h3>
                <p className="text-gray-700 dark:text-gray-200">No registration required. Get a disposable email address instantly and start receiving emails.</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Privacy First</h3>
                <p className="text-gray-700 dark:text-gray-200">Protect your real email from spam, phishing, and unwanted subscriptions with our secure service.</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Edit2 className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Fully Customizable</h3>
                <p className="text-gray-700 dark:text-gray-200">Unlike other services, we let you customize your email address during your first session.</p>
              </div>
            </div>
          </div>
        </section>
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
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/50 sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center">
                <Mail className="w-8 h-8 text-blue-500 dark:text-blue-300" />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">SnapMails</span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
                <Link to="/features" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors">Features</Link>
                <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  )}
                </button>
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  )}
                </button>
                <button 
                  className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link 
                  to="/" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/features" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/about" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </div>
            </div>
          )}
        </header>

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

        {/* PWA Installation Prompt */}
        <PWAPrompt />

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                  <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">SnapMails</span>
                </div>
                <p className="mt-4 text-sm text-gray-700 dark:text-gray-200">
                  Secure, disposable email addresses for your privacy needs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Product</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/features" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">Features</Link></li>
                  <li><Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">About</Link></li>
                  <li><Link to="/faq" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Legal</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/privacy" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">Terms of Service</Link></li>
                  <li><a href="https://www.guerrillamail.com/GuerrillaMailAPI.html" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">API Documentation</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Connect</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="mailto:erolledph@gmail.com" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-700 dark:text-gray-200">
              <p>© 2025 SnapMails. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
