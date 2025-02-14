// Guerrilla Mail API client
// Implements Guerrilla Mail JSON API v1.6
import { generateEmailUser } from './words';

const API_BASE = 'https://api.guerrillamail.com/ajax.php';
const SESSION_STORAGE_KEY = 'tempmail_session';
const RETRY_DELAY = 1000; // Base delay in milliseconds
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 30000; // 30 seconds

interface EmailAddress {
  email_addr: string;
  email_timestamp: number;
  sid_token: string;
  alias: string;
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

  constructor() {
    this.initializeSession();
  }

  private initializeSession() {
    try {
      const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const { sidToken } = JSON.parse(savedSession);
        if (sidToken) {
          this.sidToken = sidToken;
          return;
        }
      }

      const sidToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('PHPSESSID='))
        ?.split('=')[1];

      if (sidToken) {
        this.sidToken = sidToken;
      }
    } catch (error) {
      console.warn('Failed to initialize session:', error);
    }
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
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
              ip: '127.0.0.1',
              agent: navigator.userAgent.substring(0, 160),
              ...(this.sidToken ? { sid_token: this.sidToken } : {})
            });

            const response = await fetch(`${API_BASE}?${searchParams}`, {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
              }
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
            if (this.retryCount < MAX_RETRIES) {
              this.retryCount++;
              const delay = Math.min(
                RETRY_DELAY * Math.pow(2, this.retryCount - 1) + Math.random() * 1000,
                REQUEST_TIMEOUT
              );
              await new Promise(resolve => setTimeout(resolve, delay));
              this.request<T>(endpoint, params).then(resolve).catch(reject);
            } else {
              reject(error);
            }
          }
        })
        .catch(reject);
    });
  }

  private updateSession(sidToken: string) {
    this.sidToken = sidToken;
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ sidToken }));
    const expires = new Date(Date.now() + 3600000);
    document.cookie = `PHPSESSID=${sidToken}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
  }

  async getEmailAddress(lang = 'en'): Promise<EmailAddress> {
    try {
      const emailUser = generateEmailUser();
      return await this.setEmailUser(emailUser, lang);
    } catch (error) {
      console.error('Failed to get email address:', error);
      throw new Error('Failed to generate email address. Please try again.');
    }
  }

  async setEmailUser(emailUser: string, lang = 'en'): Promise<EmailAddress> {
    try {
      return await this.request<EmailAddress>('set_email_user', { email_user: emailUser, lang });
    } catch (error) {
      console.error('Failed to set email user:', error);
      throw new Error('Failed to set email address. Please try again.');
    }
  }

  async checkEmail(seq = '0'): Promise<EmailList> {
    try {
      const response = await this.request<EmailList>('check_email', { seq });
      if (response.list) {
        response.list = this.filterWelcomeEmails(response.list);
      }
      return response;
    } catch (error) {
      console.error('Failed to check email:', error);
      throw new Error('Failed to check emails. Please try again.');
    }
  }

  async getEmailList(offset = '0', seq = '0'): Promise<EmailList> {
    try {
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
      this.sidToken = null;
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      document.cookie = 'PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      const emailUser = this.generateEmailUser();
      return await this.setEmailUser(emailUser);
    } catch (error) {
      console.error('Failed to forget email:', error);
      throw new Error('Failed to get new email address. Please try again.');
    }
  }

  async deleteEmail(emailIds: string[]): Promise<{ deleted_ids: string[] }> {
    try {
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