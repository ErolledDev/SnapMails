import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import {
  Mail,
  RefreshCw,
  Copy,
  Edit2,
  AlertCircle,
  ChevronDown,
  Trash2,
  Maximize2,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GuerrillaClient } from '../lib/guerrilla';

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
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="font-medium dark:text-white">{email.mail_subject}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              From: {email.mail_from}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Date: {email.mail_date}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: email.mail_body || '' }} />
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
const ORIGINAL_TITLE = document.title;

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

const EditButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      title="Change Email"
      aria-label="Change email address"
    >
      <Edit2 className="w-4 h-4 dark:text-gray-300" aria-hidden="true" />
    </button>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
    <Mail className="w-12 h-12 mb-2 text-gray-400" />
    <p className="text-center text-gray-600 font-medium">No emails yet</p>
    <p className="text-sm text-gray-400 mt-2 text-center">
      Waiting for new emails... They'll appear here automatically
    </p>
  </div>
);

const EmailBox = () => {
  const [client] = useState(() => new GuerrillaClient());
  const [emailAddress, setEmailAddress] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [modalEmail, setModalEmail] = useState<Email | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmailUser, setNewEmailUser] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<keyof typeof EMAIL_DOMAINS>('sharklasers');
  const [emailTimestamp, setEmailTimestamp] = useState<number>(0);
  const [isTrashDisabled, setIsTrashDisabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimerRef = useRef<number>();
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
      setError(null);
      
      const now = Date.now();
      if (now - lastCheckRef.current < 5000) {
        return;
      }
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
        
        toast.success(
          `New email from ${latestEmail.mail_from}\n${latestEmail.mail_subject}`, 
          {
            duration: 5000,
            position: 'top-right',
            icon: '📧'
          }
        );
      }
      
      previousEmailCountRef.current = newEmails.length;
      setEmails(newEmails);
    } catch (error) {
      console.error('Failed to check emails:', error);
      toast.error('Failed to check emails. Retrying...', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      if (showLoading) {
        setIsRefreshing(false);
        setInitialLoading(false);
      }
    }
  }, [client, emails]);

  const handleEmailClick = useCallback(async (email: Email) => {
    try {
      setError(null);
      const fullEmail = await client.fetchEmail(email.mail_id);
      setSelectedEmail({ ...email, mail_body: fullEmail.mail_body });
      document.title = ORIGINAL_TITLE;
    } catch (error) {
      console.error('Failed to fetch email:', error);
      toast.error('Failed to load email content. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  }, [client]);

  const handleDeleteEmail = useCallback(async (emailId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await client.deleteEmail([emailId]);
      setEmails(prevEmails => prevEmails.filter(email => email.mail_id !== emailId));
      if (selectedEmail?.mail_id === emailId) {
        setSelectedEmail(null);
      }
      toast.success('Email deleted successfully', {
        duration: 2000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error('Failed to delete email', {
        duration: 3000,
        position: 'top-right',
      });
    }
  }, [client, selectedEmail]);

  const openEmailModal = useCallback(async (email: Email, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const fullEmail = await client.fetchEmail(email.mail_id);
      setModalEmail({ ...email, mail_body: fullEmail.mail_body });
    } catch (error) {
      toast.error('Failed to load email content', {
        duration: 3000,
        position: 'top-right',
      });
    }
  }, [client]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        document.title = ORIGINAL_TITLE;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const debouncedCheckEmails = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (showLoading = false) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => checkEmails(showLoading), 300);
      };
    })(),
    [checkEmails]
  );

  const handleCopy = useCallback(() => {
    const displayEmail = getDisplayEmail();
    navigator.clipboard.writeText(displayEmail)
      .then(() => {
        toast.success('Email address copied to clipboard', {
          duration: 2000,
          position: 'top-right',
        });
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy email address', {
          duration: 3000,
          position: 'top-right',
        });
      });
  }, [getDisplayEmail]);

  const handleRefresh = useCallback(() => {
    if (!isRefreshing) {
      checkEmails(true);
      toast.success('Checking for new emails...', {
        duration: 2000,
        position: 'top-right',
      });
    }
  }, [checkEmails, isRefreshing]);

  const handleNewEmail = useCallback(async () => {
    if (isTrashDisabled) {
      toast.error('Please wait before generating a new email', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }

    try {
      setIsTrashDisabled(true);
      setError(null);
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
      setSelectedEmail(null);
      
      localStorage.setItem(EMAIL_STORAGE_KEY, response.email_addr);
      localStorage.setItem(EMAIL_TIMESTAMP_KEY, String(newTimestamp));
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        email: response.email_addr,
        timestamp: newTimestamp,
        domain: selectedDomain
      }));
      
      toast.success('New email address generated', {
        duration: 3000,
        position: 'top-right',
      });
      
      checkEmails(false);
      
      setTimeout(() => {
        setIsTrashDisabled(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to get new email:', error);
      toast.error('Failed to generate new email address', {
        duration: 3000,
        position: 'top-right',
      });
      isNewEmailRef.current = false;
    }
  }, [client, checkEmails, isTrashDisabled, selectedDomain]);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      const response = await client.setEmailUser(newEmailUser);
      setEmailAddress(response.email_addr);
      setIsEditing(false);
      setEmailTimestamp(Date.now());
      
      toast.success('Email address updated successfully', {
        duration: 3000,
        position: 'top-right',
      });
      
      checkEmails(false);
    } catch (error) {
      console.error('Failed to change email:', error);
      toast.error('Failed to change email address', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const handleDomainChange = async (domain: keyof typeof EMAIL_DOMAINS) => {
    try {
      setError(null);
      setSelectedDomain(domain);
      const username = emailAddress.split('@')[0];
      const response = await client.setEmailUser(username);
      setEmailAddress(response.email_addr);
      setNewEmailUser(username);
      localStorage.setItem(DOMAIN_STORAGE_KEY, domain);
      
      toast.success('Domain changed successfully', {
        duration: 3000,
        position: 'top-right',
      });
      
      checkEmails(false);
    } catch (error) {
      console.error('Failed to change domain:', error);
      toast.error('Failed to change domain', {
        duration: 3000,
        position: 'top-right',
      });
      setSelectedDomain(prevDomain => prevDomain);
    }
  };

  useEffect(() => {
    const initializeEmail = async () => {
      try {
        if (isNewEmailRef.current) {
          return;
        }

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
        console.error('Failed to initialize email:', error);
        toast.error('Failed to initialize email. Please refresh the page.', {
          duration: 5000,
          position: 'top-right',
        });
      } finally {
        setInitialLoading(false);
      }
    };

    initializeEmail();

    const refreshInterval = setInterval(() => {
      checkEmails(false);
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [client, checkEmails]);

  useEffect(() => {
    const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
    const savedEmails = localStorage.getItem(EMAILS_STORAGE_KEY);
    const savedDomain = localStorage.getItem(DOMAIN_STORAGE_KEY) as keyof typeof EMAIL_DOMAINS;
    const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    
    const sessionTimestamp = savedSession ? JSON.parse(savedSession).timestamp : null;
    const cookieTimestamp = document.cookie
      .split('; ')
      .find(row => row.startsWith('email_timestamp='))
      ?.split('=')[1];
    
    const savedTimestamp = sessionTimestamp || cookieTimestamp || localStorage.getItem(EMAIL_TIMESTAMP_KEY);
    
    if (savedEmail) {
      setEmailAddress(savedEmail);
      setNewEmailUser(savedEmail.split('@')[0]);
    }
    
    if (savedEmails) {
      try {
        const parsedEmails = JSON.parse(savedEmails);
        setEmails(parsedEmails);
        previousEmailCountRef.current = parsedEmails.length;
      } catch (e) {
        console.error('Failed to parse saved emails:', e);
      }
    }

    if (savedDomain && EMAIL_DOMAINS[savedDomain]) {
      setSelectedDomain(savedDomain);
    }

    if (savedTimestamp) {
      setEmailTimestamp(Number(savedTimestamp));
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
      <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 h-[600px]">
          <div className="border-r border-gray-200 dark:border-gray-700"></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Your temporary email address:</div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={handleRefresh} 
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180'}`}
              title="Refresh emails"
              aria-label="Refresh emails"
              disabled={isRefreshing}
            >
              <RefreshCw className="w-4 h-4 dark:text-gray-300" aria-hidden="true" />
            </button>
            <div className="relative">
              <button 
                onClick={handleCopy} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" 
                title="Copy email address"
                aria-label="Copy email address to clipboard"
              >
                <Copy className="w-4 h-4 dark:text-gray-300" aria-hidden="true" />
              </button>
              {showCopied && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg animate-fade-in-out">
                  Copied!
                </div>
              )}
            </div>
            <EditButton onClick={() => setIsEditing(true)} />
            <button
              onClick={handleNewEmail}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors ${
                isTrashDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={isTrashDisabled ? 'Please wait before generating a new email' : 'Get new email'}
              aria-label={isTrashDisabled ? 'Please wait before generating a new email' : 'Get new email address'}
              disabled={isTrashDisabled}
            >
              <Trash2 className="w-4 h-4 text-red-500" aria-hidden="true" />
            </button>
          </div>
        </div>
        {isEditing ? (
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div className="flex-1">
              <label htmlFor="email-username" className="sr-only">Email username</label>
              <div className="flex items-center gap-2">
                <input
                  id="email-username"
                  type="text"
                  value={newEmailUser}
                  onChange={(e) => setNewEmailUser(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter new email username"
                  aria-label="New email username"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {EMAIL_DOMAINS[selectedDomain]}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="font-mono text-lg mb-2 dark:text-white">{getDisplayEmail()}</div>
            <div className="inline-block relative w-64">
              <label htmlFor="domain-select" className="sr-only">Select email domain</label>
              <select
                id="domain-select"
                value={selectedDomain}
                onChange={(e) => handleDomainChange(e.target.value as keyof typeof EMAIL_DOMAINS)}
                className="block w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm dark:text-white"
              >
                {Object.entries(EMAIL_DOMAINS).map(([key, domain]) => (
                  <option key={key} value={key}>
                    {domain}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-[600px]">
        <div className="border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          {isRefreshing ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : emails.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {emails.map((email) => (
                <button
                  key={email.mail_id}
                  onClick={() => handleEmailClick(email)}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group ${
                    selectedEmail?.mail_id === email.mail_id ? 'bg-blue-50 dark:bg-blue-900/50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium truncate flex-1 dark:text-white">{email.mail_from}</div>
                    <div className="flex items-center ml-2 space-x-1">
                      <button
                        onClick={(e) => handleDeleteEmail(email.mail_id, e)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-all"
                        title="Delete email"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                      <button
                        onClick={(e) => openEmailModal(email, e)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                        title="Open in full view"
                      >
                        <Maximize2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{email.mail_date}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium truncate mb-1 dark:text-gray-200">{email.mail_subject}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{email.mail_excerpt}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-y-auto bg-gray-50 dark:bg-gray-800">
          {selectedEmail ? (
            <div className="p-4">
              <div className="mb-4">
                <div className="font-medium mb-2 dark:text-white">{selectedEmail.mail_subject}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">From: {selectedEmail.mail_from}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Date: {selectedEmail.mail_date}</div>
              </div>
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedEmail.mail_body || '' }} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <Mail className="w-12 h-12 mb-2" />
              <p>Select an email to read</p>
            </div>
          )}
        </div>
      </div>

      {modalEmail && (
        <EmailModal
          email={modalEmail}
          onClose={() => setModalEmail(null)}
        />
      )}
    </div>
  );
};

export default React.memo(EmailBox);