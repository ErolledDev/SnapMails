// Guerrilla Mail API client
// Implements Guerrilla Mail JSON API v1.6
import { generateEmailUser } from './words';

const API_BASE = 'https://api.guerrillamail.com/ajax.php';
const SESSION_STORAGE_KEY = 'tempmail_session';

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
  private maxRetries = 3;
  private retryDelay = 1000; // Base delay in milliseconds

  constructor() {
    // Try to restore session from session storage first, then cookie
    const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        const { sidToken } = JSON.parse(savedSession);
        if (sidToken) {
          this.sidToken = sidToken;
        }
      } catch (e) {
        // Silently handle parse error
      }
    } else {
      const sidToken = document.cookie.split('; ').find(row => row.startsWith('PHPSESSID='))?.split('=')[1];
      if (sidToken) {
        this.sidToken = sidToken;
      }
    }
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    try {
      // Add abort controller for timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const searchParams = new URLSearchParams({
        f: endpoint,
        ...params,
        ip: '127.0.0.1',
        agent: navigator.userAgent.substring(0, 160),
        ...(this.sidToken ? { sid_token: this.sidToken } : {})
      });

      const response = await fetch(`${API_BASE}?${searchParams}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment...');
        }
        if (response.status >= 500) {
          throw new Error('Email service temporarily unavailable. Retrying...');
        }
        throw new Error(`Connection issue. Reconnecting...`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.sid_token) {
        this.sidToken = data.sid_token;
        // Save to session storage
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ sidToken: data.sid_token }));
        // Set session cookie with proper expiration
        const expires = new Date(Date.now() + 3600000); // 1 hour
        document.cookie = `PHPSESSID=${data.sid_token}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
      }

      this.retryCount = 0; // Reset retry count on success
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Connection timeout. Retrying...');
        }
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          // Exponential backoff with jitter
          const delay = Math.min(
            this.retryDelay * Math.pow(2, this.retryCount - 1) + Math.random() * 1000,
            30000 // Max delay of 30 seconds
          );
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, params);
        }
        throw error;
      }
      throw new Error('Connection lost. Reconnecting...');
    }
  }

  async getEmailAddress(lang = 'en'): Promise<EmailAddress> {
    try {
      const emailUser = generateEmailUser();
      const response = await this.setEmailUser(emailUser, lang);
      this.retryCount = 0; // Reset retry count on success
      return response;
    } catch (error) {
      throw new Error('Unable to generate email address. Please try again.');
    }
  }

  async setEmailUser(emailUser: string, lang = 'en'): Promise<EmailAddress> {
    try {
      const response = await this.request<EmailAddress>('set_email_user', { email_user: emailUser, lang });
      // Store the email timestamp in a cookie
      document.cookie = `email_timestamp=${Date.now()}; path=/; max-age=3600; SameSite=Strict`;
      this.retryCount = 0; // Reset retry count on success
      return response;
    } catch (error) {
      throw new Error('Unable to set email address. Please try again.');
    }
  }

  async checkEmail(seq = '0'): Promise<EmailList> {
    try {
      const response = await this.request<EmailList>('check_email', { seq });
      // Filter out welcome message
      if (response.list) {
        response.list = response.list.filter(email => 
          !(email.mail_from === 'no-reply@guerrillamail.com' && 
            email.mail_subject.includes('Welcome to Guerrilla Mail'))
        );
      }
      this.retryCount = 0; // Reset retry count on success
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Propagate the specific error message
      }
      throw new Error('Connection lost. Reconnecting...');
    }
  }

  async getEmailList(offset = '0', seq = '0'): Promise<EmailList> {
    try {
      const response = await this.request<EmailList>('get_email_list', { offset, seq });
      // Filter out welcome message
      if (response.list) {
        response.list = response.list.filter(email => 
          !(email.mail_from === 'no-reply@guerrillamail.com' && 
            email.mail_subject.includes('Welcome to Guerrilla Mail'))
        );
      }
      this.retryCount = 0; // Reset retry count on success
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Propagate the specific error message
      }
      throw new Error('Connection lost. Reconnecting...');
    }
  }

  async fetchEmail(emailId: string): Promise<EmailContent> {
    try {
      const response = await this.request<EmailContent>('fetch_email', { email_id: emailId });
      this.retryCount = 0; // Reset retry count on success
      return response;
    } catch (error) {
      throw new Error('Unable to fetch email content. Please try again.');
    }
  }

  async forgetMe(emailAddr: string): Promise<boolean> {
    try {
      const response = await this.request<boolean>('forget_me', { email_addr });
      this.retryCount = 0; // Reset retry count on success
      return response;
    } catch (error) {
      throw new Error('Unable to forget email address. Please try again.');
    }
  }

  async deleteEmail(emailIds: string[]): Promise<{ deleted_ids: string[] }> {
    try {
      const params: Record<string, string> = {};
      emailIds.forEach((id, index) => {
        params[`email_ids[${index}]`] = id;
      });
      const response = await this.request('del_email', params);
      this.retryCount = 0; // Reset retry count on success
      return response;
    } catch (error) {
      throw new Error('Unable to delete emails. Please try again.');
    }
  }
}