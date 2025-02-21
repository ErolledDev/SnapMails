import React, { useState, useEffect, Suspense } from 'react';
import {
  Mail,
  Shield,
  Clock,
  Lock,
  Menu,
  X,
  Edit2,
  Moon,
  Sun,
  CheckCircle,
  Award,
} from 'lucide-react';
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import EmailBox from './components/EmailBox';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import About from './pages/About';
import Features from './pages/Features';
import NotFound from './pages/NotFound';
import FAQ from './pages/FAQ';
import PWAPrompt from './components/PWAPrompt';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ComparisonSection = () => (
  <section className="py-16 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 ">
        Why Choose SnapMails?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-md transition-all hover:-translate-y-1">
          <h3 className="text-xl font-bold mb-4">Other Services</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <X className="w-5 h-5 text-red-500 mr-2" />
              Random email addresses only
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <X className="w-5 h-5 text-red-500 mr-2" />
              Limited domain options
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <X className="w-5 h-5 text-red-500 mr-2" />
              Basic interface
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <X className="w-5 h-5 text-red-500 mr-2" />
              No customization
            </li>
          </ul>
        </div>
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg transform md:-translate-y-4 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4 ">
            <h3 className="text-xl font-bold">SnapMails</h3>
            <Award className="w-6 h-6" />
          </div>
          <ul className="space-y-3">
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-300 mr-2" />
              Customizable email addresses
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-300 mr-2" />
              Many domain options
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-300 mr-2" />
              Modern, user-friendly interface
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-300 mr-2" />
              Full customization control
            </li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-md transition-all hover:-translate-y-1">
          <h3 className="text-xl font-bold mb-4">Premium Services</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Custom addresses
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <X className="w-5 h-5 text-red-500 mr-2" />
              Expensive
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <X className="w-5 h-5 text-red-500 mr-2" />
              Registration required
            </li>
            <li className="flex items-center text-gray-600 dark:text-gray-300">
              <X className="w-5 h-5 text-red-500 mr-2" />
              Complex setup
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-16">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: 'Sarah Chen',
            role: 'Web Developer',
            content:
              'The customization options are amazing! Finally a temp mail service that lets me choose my own address.',
            image:
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
          },
          {
            name: 'Michael Torres',
            role: 'Digital Marketer',
            content:
              'Clean interface, fast email delivery, and great privacy features. Exactly what I needed for testing.',
            image:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
          },
          {
            name: 'Emma Wilson',
            role: 'UX Designer',
            content:
              "The best temporary email service I've used. The dark mode and mobile support are fantastic.",
            image:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
          },
        ].map((testimonial, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {testimonial.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Home = () => {
  return (
    <ErrorBoundary>
      <div className="relative">
        <div className="relative">
          <div className="text-center max-w-4xl mx-auto px-4 pt-16 pb-12">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-300">
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

        <ComparisonSection />
        <TestimonialsSection />

        <section id="features" className="py-16 relative overflow-hidden">
          <div className="relative">
            <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Quick Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Instant Access
                </h3>
                <p className="text-gray-700 dark:text-gray-200">
                  No registration required. Get a disposable email address
                  instantly and start receiving emails.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Privacy First
                </h3>
                <p className="text-gray-700 dark:text-gray-200">
                  Protect your real email from spam, phishing, and unwanted
                  subscriptions with our secure service.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Edit2 className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Fully Customizable
                </h3>
                <p className="text-gray-700 dark:text-gray-200">
                  Unlike other services, we let you customize your email address
                  during your first session.
                </p>
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
        <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/50 sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center">
                <Mail className="w-8 h-8 text-blue-500 dark:text-blue-300" />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                  SnapMails
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/"
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/features"
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  About
                </Link>
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

        <PWAPrompt />

        <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                  <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                    SnapMails
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-700 dark:text-gray-200">
                  Customizable Temporary disposable email addresses for your privacy needs.
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
                      className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
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
                      className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://www.guerrillamail.com"
                      className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
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
                      className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                    >
                      Contact Us
                    </a>
                  </li>
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