import React, { useState, useEffect, Suspense, lazy, useCallback, useRef } from 'react';
import {
  Mail,
  Menu,
  X,
  Moon,
  Sun,
  RefreshCw,
  Copy,
  Edit2,
  ChevronDown,
  Trash2,
  Check,
  Loader2,
  Inbox,
  Clock,
  User,
} from 'lucide-react';
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster, toast } from 'react-hot-toast';
import { GuerrillaClient } from './lib/guerrilla';

// Lazy load pages
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const About = lazy(() => import('./pages/About'));
const Features = lazy(() => import('./pages/Features'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PWAPrompt = lazy(() => import('./components/PWAPrompt'));

// Loading & Empty States
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
  </div>
);

const EmptyInbox = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-5">
      <Inbox className="w-10 h-10 text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No emails yet</h3>
    <p className="text-gray-600 dark:text-gray-400 max-w-md">
      Waiting for new emails... They'll appear here automatically.
    </p>
  </div>
);

// Types
interface Email {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_excerpt: string;
  mail_timestamp: string;
  mail_read: string;
  mail_date: string;
  mail_body?: string;
}

// Email Modal
const EmailModal: React.FC<{ email: Email; onClose: () => void }> = ({ email, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{email.mail_subject}</h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {email.mail_from}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {email.mail_date}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: email.mail_body || '<p>No content available.</p>' }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={() => copy(email.mail_from)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4" /> Copy Sender
          </button>
          <button
            onClick={() => copy(email.mail_subject)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Mail className="w-4 h-4" /> Copy Subject
          </button>
        </div>
      </div>
    </div>
  );
};

// Constants
const REFRESH_INTERVAL = 15000;
const EMAIL_DOMAINS = {
  sharklasers: '@sharklasers.com',
  guerrillamail: '@guerrillamail.com',
  grr: '@grr.la',
  guerrillamail_biz: '@guerrillamail.biz',
  guerrillamail_de: '@guerrillamail.de',
  pokemail: '@pokemail.net',
} as const;

const STORAGE_KEYS = {
  EMAIL: 'tempmail_email',
  EMAILS: 'tempmail_emails',
  DOMAIN: 'tempmail_domain',
  TIMESTAMP: 'tempmail_timestamp',
  SESSION: 'tempmail_session',
};

const ORIGINAL_TITLE = 'SnapMails - Free Temporary Email';

// Home Component
const Home: React.FC = () => {
  const [client] = useState(() => new GuerrillaClient());
  const [emailAddress, setEmailAddress] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [modalEmail, setModalEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<keyof typeof EMAIL_DOMAINS>('sharklasers');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const lastCheckRef = useRef(0);
  const prevCountRef = useRef(0);

  const fullEmail = `${emailAddress.split('@')[0]}${EMAIL_DOMAINS[selectedDomain]}`;

  // Copy email
  const copyEmail = () => {
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    toast.success('Email copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Check emails
  const checkEmails = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);
    const now = Date.now();
    if (now - lastCheckRef.current < 3000) return;
    lastCheckRef.current = now;

    try {
      const res = await client.checkEmail();
      const emailMap = new Map(emails.map(e => [e.mail_id, e]));
      res.list.forEach(e => emailMap.set(e.mail_id, e));
      const sorted = Array.from(emailMap.values()).sort((a, b) => +b.mail_timestamp - +a.mail_timestamp);

      if (sorted.length > prevCountRef.current && prevCountRef.current > 0) {
        const newCount = sorted.length - prevCountRef.current;
        document.title = `(${newCount}) New Mail – SnapMails`;
        toast.success(`${newCount} new message${newCount > 1 ? 's' : ''}!`, { icon: 'New' });
      }
      prevCountRef.current = sorted.length;
      setEmails(sorted);
    } catch {
      toast.error('Failed to fetch emails');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [client, emails]);

  // Open email
  const openEmail = async (email: Email) => {
    try {
      const full = await client.fetchEmail(email.mail_id);
      setModalEmail({ ...email, mail_body: full.mail_body });
      document.title = ORIGINAL_TITLE;
    } catch {
      toast.error('Failed to load email');
    }
  };

  // Delete email
  const deleteEmail = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await client.deleteEmail([id]);
      setEmails(prev => prev.filter(e => e.mail_id !== id));
      toast.success('Email deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  // Generate new email
  const generateNewEmail = async () => {
    setIsGenerating(true);
    try {
      const res = await client.getEmailAddress();
      const username = res.email_addr.split('@')[0];
      setEmailAddress(res.email_addr);
      setNewUsername(username);
      setEmails([]);
      localStorage.setItem(STORAGE_KEYS.EMAIL, res.email_addr);
      localStorage.setItem(STORAGE_KEYS.TIMESTAMP, String(Date.now()));
      toast.success('New email generated!');
      checkEmails();
    } catch {
      toast.error('Failed to generate email');
    } finally {
      setIsGenerating(false);
    }
  };

  // Change domain
  const changeDomain = async (domain: keyof typeof EMAIL_DOMAINS) => {
    setSelectedDomain(domain);
    localStorage.setItem(STORAGE_KEYS.DOMAIN, domain);
    toast.success('Domain updated');
  };

  // Save username
  const saveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await client.setEmailUser(newUsername);
      setEmailAddress(res.email_addr);
      setIsEditing(false);
      toast.success('Email updated');
    } catch {
      toast.error('Invalid username');
    }
  };

  // Initialize
  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem(STORAGE_KEYS.EMAIL);
      const domain = localStorage.getItem(STORAGE_KEYS.DOMAIN) as keyof typeof EMAIL_DOMAINS;

      if (domain && EMAIL_DOMAINS[domain]) setSelectedDomain(domain);
      if (saved) {
        const user = saved.split('@')[0];
        await client.setEmailUser(user);
        setEmailAddress(saved);
        setNewUsername(user);
      } else {
        const res = await client.getEmailAddress();
        setEmailAddress(res.email_addr);
        setNewUsername(res.email_addr.split('@')[0]);
        localStorage.setItem(STORAGE_KEYS.EMAIL, res.email_addr);
      }
      checkEmails();
    };
    init();

    const interval = setInterval(() => checkEmails(), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Free Temporary Email - SnapMails</title>
        <meta name="description" content="Instant disposable email. No signup. Auto-refresh. Privacy first." />
      </Helmet>

      {/* Main Content - No Extra Bottom Padding */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-5xl">
            {/* Main Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full max-h-[80vh]">
              {/* Sticky Email Bar */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-5 z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your temporary email address:</p>
                    {isEditing ? (
                      <form onSubmit={saveUsername} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={e => setNewUsername(e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-lg font-medium dark:bg-gray-700 dark:text-white"
                          autoFocus
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">{EMAIL_DOMAINS[selectedDomain]}</span>
                        <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Check className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3">
                        <code className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white break-all">{fullEmail}</code>
                        <button
                          onClick={copyEmail}
                          className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                        </button>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedDomain}
                      onChange={e => changeDomain(e.target.value as keyof typeof EMAIL_DOMAINS)}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(EMAIL_DOMAINS).map(([key, domain]) => (
                        <option key={key} value={key}>{domain}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => checkEmails(true)}
                      disabled={isRefreshing}
                      className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={generateNewEmail}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Email List - Takes Remaining Space */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {isRefreshing ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : emails.length === 0 ? (
                  <EmptyInbox />
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {emails.map(email => {
                      const sender = email.mail_from.split('<')[0].trim();
                      return (
                        <button
                          key={email.mail_id}
                          onClick={() => openEmail(email)}
                          className="w-full p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">
                              {sender[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {sender}
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                  {email.mail_date}
                                </span>
                              </div>
                              <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                                {email.mail_subject}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                {email.mail_excerpt}
                              </p>
                            </div>
                            <button
                              onClick={e => deleteEmail(email.mail_id, e)}
                              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {modalEmail && <EmailModal email={modalEmail} onClose={() => setModalEmail(null)} />}
      </div>
    </>
  );
};

// Main App
const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => setIsMenuOpen(false), [location]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  SnapMails
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Home</Link>
                <Link to="/features" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Features</Link>
                <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">About</Link>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </nav>

              <div className="md:hidden flex items-center gap-2">
                <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3 space-y-1">
                <Link to="/" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/features" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Features</Link>
                <Link to="/about" className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>About</Link>
              </div>
            </div>
          )}
        </header>

        {/* Routes */}
        <main className="flex-1">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
                <Route path="/404" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Footer - No mt-16 */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">SnapMails</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Instant, secure, disposable email addresses.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Features</Link></li>
                  <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">About</Link></li>
                  <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">FAQ</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Privacy</Link></li>
                  <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Terms</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="mailto:support@snapmails.xyz" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500">
              © 2025 SnapMails. All rights reserved.
            </div>
          </div>
        </footer>

        <Suspense fallback={null}>
          <PWAPrompt />
        </Suspense>

        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
};

export default App;