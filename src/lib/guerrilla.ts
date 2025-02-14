// Guerrilla Mail API client
// Implements Guerrilla Mail JSON API v1.6
import { generateEmailUser } from './words';

const API_BASE = 'https://api.guerrillamail.com/ajax.php';
const SESSION_STORAGE_KEY = 'tempmail_session';
const RETRY_DELAY = 1000; // Base delay in milliseconds
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 30000; // 30 seconds
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

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

  constructor() {
    this.initializeSession();
  }

  private async initializeSession() {
    try {
      // First try to get session from storage
      const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const { sidToken } = JSON.parse(savedSession);
        if (sidToken) {
          this.sidToken = sidToken;
          this.isInitialized = true;
          return;
        }
      }

      // Then try to get from cookie
      const sidToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('PHPSESSID='))
        ?.split('=')[1];

      if (sidToken) {
        this.sidToken = sidToken;
        this.isInitialized = true;
      }
    } catch (error) {
      console.warn('Failed to initialize session:', error);
      // Don't set isInitialized to true if there's an error
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initializeSession();
      if (!this.isInitialized) {
        // If still not initialized, try to get a new session
        try {
          const response = await this.request<EmailAddress>('get_email_address', { lang: 'en' });
          if (response.sid_token) {
            this.updateSession(response.sid_token);
            return;
          }
        } catch (error) {
          console.error('Failed to initialize new session:', error);
        }
        throw new Error('Failed to initialize email client. Please refresh the page.');
      }
    }
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }

    return new Promise((resolve, reject) => {
      this.requestQueue = this.requestQueue
        .then(async () => {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

            const searchParams = new URLSearchParams({
              f: endpoint,
              ...params,
              ...(this.sidToken ? { sid_token: this.sidToken } : {})
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

            clearTimeout(timeout);
            this.lastRequestTime = Date.now();

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
              throw new Error(data.error);
            }

            if (data.sid_token) {
              this.updateSession(data.sid_token);
            }

            this.retryCount = 0;
            resolve(data);
          } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
              reject(new Error('Request timed out. Please try again.'));
              return;
            }

            if (this.retryCount < MAX_RETRIES) {
              this.retryCount++;
              const delay = Math.min(
                RETRY_DELAY * Math.pow(2, this.retryCount - 1) + Math.random() * 1000,
                REQUEST_TIMEOUT
              );
              console.warn(`Retrying request (${this.retryCount}/${MAX_RETRIES}) after ${delay}ms`);
              await new Promise(resolve => setTimeout(resolve, delay));
              this.request<T>(endpoint, params).then(resolve).catch(reject);
            } else {
              this.retryCount = 0;
              reject(new Error('Failed to connect to email server. Please try again later.'));
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
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ sidToken }));
      const expires = new Date(Date.now() + 3600000); // 1 hour
      document.cookie = `PHPSESSID=${sidToken}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    } catch (error) {
      console.warn('Failed to update session storage:', error);
    }
  }

  async getEmailAddress(lang = 'en'): Promise<EmailAddress> {
    try {
      const response = await this.request<EmailAddress>('get_email_address', { lang });
      return response;
    } catch (error) {
      console.error('Failed to get email address:', error);
      throw new Error('Failed to generate email address. Please refresh and try again.');
    }
  }

  async setEmailUser(emailUser: string, lang = 'en'): Promise<EmailAddress> {
    try {
      await this.ensureInitialized();
      return await this.request<EmailAddress>('set_email_user', { email_user: emailUser, lang });
    } catch (error) {
      console.error('Failed to set email user:', error);
      throw new Error('Failed to set email address. Please try again.');
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
      if (error instanceof Error) {
        throw new Error(`Failed to check emails: ${error.message}`);
      }
      throw new Error('Failed to check emails. Please try again.');
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
      throw new Error('Failed to retrieve emails. Please try again.');
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
      throw new Error('Failed to fetch email content. Please try again.');
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
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      document.cookie = 'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      return response;
    } catch (error) {
      console.error('Failed to forget email:', error);
      throw new Error('Failed to get new email address. Please try again.');
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
      throw new Error('Failed to delete emails. Please try again.');
    }
  }
}