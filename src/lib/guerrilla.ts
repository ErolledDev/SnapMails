// Guerrilla Mail API client
// Implements Guerrilla Mail JSON API v1.6
import { generateEmailUser } from './words';

const API_BASE = 'https://api.guerrillamail.com/ajax.php';
const SESSION_STORAGE_KEY = 'tempmail_session';
const RETRY_DELAY = 1000; // Base delay in milliseconds
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 30000; // 30 seconds
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_INITIALIZATION_RETRIES = 5;
const INITIALIZATION_BACKOFF_DELAY = 2000;

interface EmailAddress {
  email_addr: string;
  email_timestamp: number;
  sid_token: string;
  alias: string;
  alias_error: string;
  site_id?: string;
  site?: string;
}

interface Email {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_excerpt: string;
  mail_timestamp: string;
  mail_read: string;
  mail_date: string;
  att: string;
}

interface EmailList {
  list: Email[];
  count: string;
  email: string;
  alias: string;
  ts: number;
  sid_token: string;
  stats?: {
    sequence_mail: string;
    created_addresses: number;
    received_emails: string;
    total: string;
    total_per_hour: string;
  };
}

interface EmailContent extends Email {
  mail_body: string;
  mail_recipient: string;
  content_type: string;
}

export class GuerrillaClient {
  private sidToken: string | null = null;
  private retryCount = 0;
  private lastRequestTime = 0;
  private requestQueue: Promise<any> = Promise.resolve();
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private initializationRetries = 0;
  private lastInitializationAttempt = 0;

  constructor() {
    // Initialize immediately but don't wait for it
    this.initializationPromise = this.initializeSession().catch(error => {
      console.error('Initial session initialization failed:', error);
      this.initializationPromise = null;
      return Promise.reject(error);
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async initializeSession(): Promise<void> {
    if (this.isInitialized) return;

    // Check if we need to wait before retrying
    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastInitializationAttempt;
    if (timeSinceLastAttempt < INITIALIZATION_BACKOFF_DELAY) {
      await this.delay(INITIALIZATION_BACKOFF_DELAY - timeSinceLastAttempt);
    }
    this.lastInitializationAttempt = Date.now();

    if (this.initializationRetries >= MAX_INITIALIZATION_RETRIES) {
      this.initializationRetries = 0;
      this.lastInitializationAttempt = 0;
      await this.delay(5000); // Wait 5 seconds before allowing new initialization attempts
      throw new Error('Failed to initialize email service after multiple attempts');
    }

    this.initializationRetries++;

    try {
      // First try to get session from storage
      const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        try {
          const { sidToken, timestamp } = JSON.parse(savedSession);
          if (sidToken && timestamp && Date.now() - timestamp < 3600000) { // 1 hour
            try {
              // Verify the token is still valid with a simple request
              const response = await this.makeRequest<EmailAddress>('get_email_address', {}, sidToken);
              if (response && response.sid_token) {
                this.sidToken = response.sid_token;
                this.isInitialized = true;
                this.initializationRetries = 0;
                this.lastInitializationAttempt = 0;
                this.updateSession(response.sid_token);
                return;
              }
            } catch (error) {
              console.warn('Saved session validation failed, creating new session');
            }
          }
        } catch (error) {
          console.warn('Invalid saved session, creating new session');
        }
      }

      // Clear any existing session data
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      this.sidToken = null;

      // Create a new session with retry logic
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await this.makeRequest<EmailAddress>('get_email_address', { lang: 'en' });
          if (response && response.sid_token) {
            this.updateSession(response.sid_token);
            this.initializationRetries = 0;
            this.lastInitializationAttempt = 0;
            return;
          }
          throw new Error('Invalid response from server');
        } catch (error) {
          if (attempt === 2) throw error;
          await this.delay(INITIALIZATION_BACKOFF_DELAY * Math.pow(2, attempt));
        }
      }
    } catch (error) {
      console.error('Session initialization failed:', error);
      this.isInitialized = false;
      
      // Add exponential backoff delay before retrying
      const backoffDelay = INITIALIZATION_BACKOFF_DELAY * Math.pow(2, this.initializationRetries - 1);
      await this.delay(backoffDelay);
      
      return this.initializeSession();
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeSession();
    }

    try {
      await this.initializationPromise;
    } catch (error) {
      // Clear the failed promise
      this.initializationPromise = null;
      this.initializationRetries = 0;
      this.lastInitializationAttempt = 0;
      
      // Wait before trying again
      await this.delay(INITIALIZATION_BACKOFF_DELAY);
      
      // Try one more time
      this.initializationPromise = this.initializeSession();
      await this.initializationPromise;
    }

    if (!this.isInitialized) {
      throw new Error('Failed to initialize email client');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, string> = {},
    overrideSidToken?: string
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const searchParams = new URLSearchParams({
        f: endpoint,
        ...params,
        ...(overrideSidToken ? { sid_token: overrideSidToken } : this.sidToken ? { sid_token: this.sidToken } : {})
      });

      const response = await fetch(`${API_BASE}?${searchParams}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Origin': window.location.origin
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, string> = {},
    overrideSidToken?: string
  ): Promise<T> {
    await this.ensureInitialized();

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await this.delay(RATE_LIMIT_DELAY - timeSinceLastRequest);
    }

    return new Promise((resolve, reject) => {
      this.requestQueue = this.requestQueue
        .then(async () => {
          try {
            const data = await this.makeRequest<T>(endpoint, params, overrideSidToken);

            if ('sid_token' in data && typeof data.sid_token === 'string') {
              this.updateSession(data.sid_token);
            }

            this.lastRequestTime = Date.now();
            this.retryCount = 0;
            resolve(data);
          } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
              reject(new Error('Request timed out'));
              return;
            }

            if (this.retryCount < MAX_RETRIES) {
              this.retryCount++;
              const delay = Math.min(
                RETRY_DELAY * Math.pow(2, this.retryCount - 1) + Math.random() * 1000,
                REQUEST_TIMEOUT
              );
              console.warn(`Retrying request (${this.retryCount}/${MAX_RETRIES}) after ${delay}ms`);
              await this.delay(delay);
              this.request<T>(endpoint, params).then(resolve).catch(reject);
            } else {
              this.retryCount = 0;
              reject(new Error('Failed to connect to email server'));
            }
          }
        })
        .catch(reject);
    });
  }

  private updateSession(sidToken: string) {
    this.sidToken = sidToken;
    this.isInitialized = true;
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ 
        sidToken,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to update session storage:', error);
    }
  }

  async getEmailAddress(lang = 'en'): Promise<EmailAddress> {
    try {
      await this.ensureInitialized();
      return await this.request<EmailAddress>('get_email_address', { lang });
    } catch (error) {
      console.error('Failed to get email address:', error);
      throw new Error('Failed to generate email address');
    }
  }

  async setEmailUser(emailUser: string, lang = 'en'): Promise<EmailAddress> {
    try {
      await this.ensureInitialized();
      return await this.request<EmailAddress>('set_email_user', { email_user: emailUser, lang });
    } catch (error) {
      console.error('Failed to set email user:', error);
      throw new Error('Failed to set email address');
    }
  }

  async checkEmail(seq = '0'): Promise<EmailList> {
    try {
      await this.ensureInitialized();
      const response = await this.request<EmailList>('check_email', { seq });
      if (response.list) {
        response.list = this.filterWelcomeEmails(response.list);
      }
      return response;
    } catch (error) {
      console.error('Failed to check email:', error);
      throw new Error('Failed to check emails');
    }
  }

  async getEmailList(offset = '0', seq = '0'): Promise<EmailList> {
    try {
      await this.ensureInitialized();
      const response = await this.request<EmailList>('get_email_list', { offset, seq });
      if (response.list) {
        response.list = this.filterWelcomeEmails(response.list);
      }
      return response;
    } catch (error) {
      console.error('Failed to get email list:', error);
      throw new Error('Failed to retrieve emails');
    }
  }

  private filterWelcomeEmails(emails: Email[]): Email[] {
    return emails.filter(email => 
      !(email.mail_from === 'no-reply@guerrillamail.com' && 
        email.mail_subject.includes('Welcome to Guerrilla Mail'))
    );
  }

  async fetchEmail(emailId: string): Promise<EmailContent> {
    try {
      await this.ensureInitialized();
      return await this.request<EmailContent>('fetch_email', { email_id: emailId });
    } catch (error) {
      console.error('Failed to fetch email:', error);
      throw new Error('Failed to fetch email content');
    }
  }

  generateEmailUser(): string {
    return generateEmailUser();
  }

  async forgetMe(emailAddr: string): Promise<EmailAddress> {
    try {
      await this.ensureInitialized();
      const response = await this.request<EmailAddress>('forget_me', { email_addr: emailAddr });
      this.sidToken = null;
      this.isInitialized = false;
      this.initializationPromise = null;
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return response;
    } catch (error) {
      console.error('Failed to forget email:', error);
      throw new Error('Failed to get new email address');
    }
  }

  async deleteEmail(emailIds: string[]): Promise<{ deleted_ids: string[] }> {
    try {
      await this.ensureInitialized();
      const params: Record<string, string> = {};
      emailIds.forEach((id, index) => {
        params[`email_ids[${index}]`] = id;
      });
      return await this.request('del_email', params);
    } catch (error) {
      console.error('Failed to delete emails:', error);
      throw new Error('Failed to delete emails');
    }
  }
}