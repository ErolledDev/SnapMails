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
} from 'lucide-react';
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster, toast } from 'react-hot-toast';
import { GuerrillaClient } from './lib/guerrilla';

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

interface ModalProps {
  email: Email;
  onClose: () => void;
}

const EmailModal: React.FC<ModalProps> = ({ email, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm sm:text-base dark:text-white break-words">{email.mail_subject}</h3>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">From: {email.mail_from}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Date: {email.mail_date}</div>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0" aria-label="Close modal">
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-sm sm:prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: email.mail_body || '' }} />
        </div>
      </div>
    </div>
  );
};

const REFRESH_INTERVAL = 15000;
const EMAIL_STORAGE_KEY = 'tempmail_email';
const EMAILS_STORAGE_KEY = 'tempmail_emails';
const DOMAIN_STORAGE_KEY = 'tempmail_domain';
const EMAIL_TIMESTAMP_KEY = 'tempmail_timestamp';
const SESSION_STORAGE_KEY = 'tempmail_session';
const ORIGINAL_TITLE = 'Free Temporary Email - Disposable Temp Mail Service | SnapMails';

const EMAIL_DOMAINS = {
  sharklasers: '@sharklasers.com',
  guerrillamailblock: '@guerrillamailblock.com',
  guerrillamail: '@guerrillamail.com',
  guerrillamail_info: '@guerrillamail.info',
  grr: '@grr.la',
  guerrillamail_biz: '@guerrillamail.biz',
  guerrillamail_de: '@guerrillamail.de',
  guerrillamail_net: '@guerrillamail.net',
  guerrillamail_org: '@guerrillamail.org',
  pokemail: '@pokemail.net',
  spam: '@spam.me'
} as const;

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
    <Mail className="w-12 h-12 mb-2 text-gray-400" />
    <p className="text-center text-gray-600 dark:text-gray-300 font-medium">No emails yet</p>
    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 text-center">
      Waiting for new emails... They'll appear here automatically
    </p>
  </div>
);

const Home: React.FC = () => {
  const [client] = useState(() => new GuerrillaClient());
  const [emailAddress, setEmailAddress] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [modalEmail, setModalEmail] = useState<Email | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmailUser, setNewEmailUser] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<keyof typeof EMAIL_DOMAINS>('sharklasers');
  const [emailTimestamp, setEmailTimestamp] = useState<number>(0);
  const [isTrashDisabled, setIsTrashDisabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastCheckRef = useRef<number>(0);
  const previousEmailCountRef = useRef(0);
  const isNewEmailRef = useRef(false);

  const getDisplayEmail = useCallback(() => {
    const username = emailAddress.split('@')[0];
    return `${username}${EMAIL_DOMAINS[selectedDomain]}`;
  }, [emailAddress, selectedDomain]);

  const checkEmails = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsRefreshing(true);
      const now = Date.now();
      if (now - lastCheckRef.current < 5000) return;
      lastCheckRef.current = now;

      const response = await client.checkEmail();
      const emailMap = new Map(emails.map(email => [email.mail_id, email]));
      response.list.forEach(email => emailMap.set(email.mail_id, email));
      const newEmails = Array.from(emailMap.values()).sort((a, b) =>
        Number(b.mail_timestamp) - Number(a.mail_timestamp)
      );

      if (newEmails.length > previousEmailCountRef.current) {
        const newEmailCount = newEmails.length - previousEmailCountRef.current;
        const latestEmail = newEmails[0];
        document.title = `(${newEmailCount}) New Message! - SnapMails`;
        toast.success(`New email from ${latestEmail.mail_from}\n${latestEmail.mail_subject}`, {
          duration: 5000,
          position: 'top-right',
          icon: '📧'
        });
      }

      previousEmailCountRef.current = newEmails.length;
      setEmails(newEmails);
    } catch (error) {
      toast.error('Failed to check emails. Retrying...', { duration: 3000, position: 'top-right' });
    } finally {
      if (showLoading) {
        setIsRefreshing(false);
        setInitialLoading(false);
      }
    }
  }, [client, emails]);

  const handleEmailClick = useCallback(async (email: Email) => {
    try {
      const fullEmail = await client.fetchEmail(email.mail_id);
      setModalEmail({ ...email, mail_body: fullEmail.mail_body });
      document.title = ORIGINAL_TITLE;
    } catch (error) {
      toast.error('Failed to load email content. Please try again.', { duration: 3000, position: 'top-right' });
    }
  }, [client]);

  const handleDeleteEmail = useCallback(async (emailId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await client.deleteEmail([emailId]);
      setEmails(prevEmails => prevEmails.filter(email => email.mail_id !== emailId));
      if (modalEmail?.mail_id === emailId) setModalEmail(null);
      toast.success('Email deleted successfully', { duration: 2000, position: 'top-right' });
    } catch (error) {
      toast.error('Failed to delete email', { duration: 3000, position: 'top-right' });
    }
  }, [client, modalEmail]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') document.title = ORIGINAL_TITLE;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(getDisplayEmail())
      .then(() => {
        toast.success('Email address copied to clipboard', { duration: 2000, position: 'top-right' });
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      })
      .catch(() => toast.error('Failed to copy email address', { duration: 3000, position: 'top-right' }));
  }, [getDisplayEmail]);

  const handleRefresh = useCallback(() => {
    if (!isRefreshing) {
      checkEmails(true);
      toast.success('Checking for new emails...', { duration: 2000, position: 'top-right' });
    }
  }, [checkEmails, isRefreshing]);

  const handleNewEmail = useCallback(async () => {
    if (isTrashDisabled) {
      toast.error('Please wait before generating a new email', { duration: 3000, position: 'top-right' });
      return;
    }

    try {
      setIsTrashDisabled(true);
      isNewEmailRef.current = true;
      const response = await client.getEmailAddress();

      localStorage.removeItem(EMAIL_STORAGE_KEY);
      localStorage.removeItem(EMAILS_STORAGE_KEY);
      localStorage.removeItem(EMAIL_TIMESTAMP_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);

      const newTimestamp = Date.now();
      setEmailAddress(response.email_addr);
      setNewEmailUser(response.email_addr.split('@')[0]);
      setEmailTimestamp(newTimestamp);
      setEmails([]);

      localStorage.setItem(EMAIL_STORAGE_KEY, response.email_addr);
      localStorage.setItem(EMAIL_TIMESTAMP_KEY, String(newTimestamp));
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        email: response.email_addr,
        timestamp: newTimestamp,
        domain: selectedDomain
      }));

      toast.success('New email address generated', { duration: 3000, position: 'top-right' });
      checkEmails(false);
      setTimeout(() => setIsTrashDisabled(false), 5000);
    } catch (error) {
      toast.error('Failed to generate new email address', { duration: 3000, position: 'top-right' });
      isNewEmailRef.current = false;
    }
  }, [client, checkEmails, isTrashDisabled, selectedDomain]);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await client.setEmailUser(newEmailUser);
      setEmailAddress(response.email_addr);
      setIsEditing(false);
      setEmailTimestamp(Date.now());
      toast.success('Email address updated successfully', { duration: 3000, position: 'top-right' });
      checkEmails(false);
    } catch (error) {
      toast.error('Failed to change email address', { duration: 3000, position: 'top-right' });
    }
  };

  const handleDomainChange = async (domain: keyof typeof EMAIL_DOMAINS) => {
    try {
      setSelectedDomain(domain);
      const username = emailAddress.split('@')[0];
      const response = await client.setEmailUser(username);
      setEmailAddress(response.email_addr);
      setNewEmailUser(username);
      localStorage.setItem(DOMAIN_STORAGE_KEY, domain);
      toast.success('Domain changed successfully', { duration: 3000, position: 'top-right' });
      checkEmails(false);
    } catch (error) {
      toast.error('Failed to change domain', { duration: 3000, position: 'top-right' });
      setSelectedDomain(prevDomain => prevDomain);
    }
  };

  useEffect(() => {
    const initializeEmail = async () => {
      try {
        if (isNewEmailRef.current) return;

        const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
        const savedTimestamp = localStorage.getItem(EMAIL_TIMESTAMP_KEY);

        if (savedEmail && savedTimestamp) {
          const emailUser = savedEmail.split('@')[0];
          const response = await client.setEmailUser(emailUser);
          setEmailAddress(response.email_addr);
          setNewEmailUser(emailUser);
          setEmailTimestamp(Number(savedTimestamp));
        } else {
          const response = await client.getEmailAddress();
          const newTimestamp = Date.now();
          setEmailAddress(response.email_addr);
          setNewEmailUser(response.email_addr.split('@')[0]);
          setEmailTimestamp(newTimestamp);

          localStorage.setItem(EMAIL_STORAGE_KEY, response.email_addr);
          localStorage.setItem(EMAIL_TIMESTAMP_KEY, String(newTimestamp));
        }

        await checkEmails(false);
      } catch (error) {
        toast.error('Failed to initialize email. Please refresh the page.', { duration: 5000, position: 'top-right' });
      } finally {
        setInitialLoading(false);
      }
    };

    initializeEmail();
    const refreshInterval = setInterval(() => checkEmails(false), REFRESH_INTERVAL);
    return () => clearInterval(refreshInterval);
  }, [client, checkEmails]);

  useEffect(() => {
    const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
    const savedEmails = localStorage.getItem(EMAILS_STORAGE_KEY);
    const savedDomain = localStorage.getItem(DOMAIN_STORAGE_KEY) as keyof typeof EMAIL_DOMAINS;

    if (savedEmail) {
      setEmailAddress(savedEmail);
      setNewEmailUser(savedEmail.split('@')[0]);
    }
    if (savedEmails) {
      try {
        const parsedEmails = JSON.parse(savedEmails);
        setEmails(parsedEmails);
        previousEmailCountRef.current = parsedEmails.length;
      } catch (e) {}
    }
    if (savedDomain && EMAIL_DOMAINS[savedDomain]) {
      setSelectedDomain(savedDomain);
    }
  }, []);

  useEffect(() => {
    if (emailAddress && emailTimestamp) {
      localStorage.setItem(EMAIL_STORAGE_KEY, emailAddress);
      localStorage.setItem(EMAIL_TIMESTAMP_KEY, String(emailTimestamp));
      localStorage.setItem(DOMAIN_STORAGE_KEY, selectedDomain);
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        email: emailAddress,
        timestamp: emailTimestamp,
        domain: selectedDomain
      }));
      document.cookie = `email_timestamp=${emailTimestamp}; path=/; SameSite=Strict`;
    }
    if (emails.length > 0) {
      localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
    }
  }, [emailAddress, emails, selectedDomain, emailTimestamp]);

  if (initialLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-900 animate-spin"></div>
          <div className="w-16 h-16 rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin absolute top-0"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Free Temporary Email - Disposable Temp Mail Service | SnapMails</title>
        <meta name="description" content="Create instant disposable email addresses with SnapMails. Protect your privacy with our secure temporary email service. No registration required, custom domains available." />
        <link rel="canonical" href="https://snapmails.xyz" />
      </Helmet>

      <div className="h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6 sm:p-8">
              {isEditing ? (
                <form onSubmit={handleEmailChange} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      value={newEmailUser}
                      onChange={(e) => setNewEmailUser(e.target.value)}
                      className="w-full sm:flex-1 px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Enter new email username"
                    />
                    <span className="text-base text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {EMAIL_DOMAINS[selectedDomain]}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Save
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Your temporary email address:</p>
                      <div className="font-mono text-xl sm:text-2xl lg:text-3xl break-all dark:text-white font-semibold">
                        {getDisplayEmail()}
                      </div>
                    </div>
                    <div className="flex gap-2 items-start flex-shrink-0">
                      <button onClick={handleRefresh} className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all ${isRefreshing ? 'animate-spin' : ''}`} title="Refresh emails" disabled={isRefreshing}>
                        <RefreshCw className="w-6 h-6 dark:text-gray-300" />
                      </button>
                      <div className="relative">
                        <button onClick={handleCopy} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Copy email">
                          <Copy className="w-6 h-6 dark:text-gray-300" />
                        </button>
                        {showCopied && (
                          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded shadow-lg animate-fade-in-out whitespace-nowrap z-10">
                            Copied!
                          </div>
                        )}
                      </div>
                      <button onClick={() => setIsEditing(true)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Edit email">
                        <Edit2 className="w-6 h-6 dark:text-gray-300" />
                      </button>
                      <button onClick={handleNewEmail} className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors ${isTrashDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} title="New email" disabled={isTrashDisabled}>
                        <Trash2 className="w-6 h-6 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="inline-block relative">
                    <select value={selectedDomain} onChange={(e) => handleDomainChange(e.target.value as keyof typeof EMAIL_DOMAINS)} className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm dark:text-white">
                      {Object.entries(EMAIL_DOMAINS).map(([key, domain]) => (
                        <option key={key} value={key}>{domain}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 max-h-[50vh] overflow-y-auto">
              {isRefreshing ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : emails.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {emails.map((email) => (
                    <button key={email.mail_id} onClick={() => handleEmailClick(email)} className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <div className="font-semibold text-base text-gray-900 dark:text-white truncate flex-1">{email.mail_from}</div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={(e) => handleDeleteEmail(email.mail_id, e)} className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-all" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                          <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{email.mail_date}</div>
                        </div>
                      </div>
                      <div className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2 truncate">{email.mail_subject}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{email.mail_excerpt}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalEmail && <EmailModal email={modalEmail} onClose={() => setModalEmail(null)} />}
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