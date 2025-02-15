// Guerrilla Mail API Client
const API_BASE = '/api/guerrillamail';

interface EmailAddress {
  email_addr: string;
  email_timestamp: number;
  sid_token: string;
  alias: string;
  alias_error: string;
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
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 1000;
  private readonly REQUEST_TIMEOUT = 30000;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(
    endpoint: string, 
    params: Record<string, string> = {},
    retryCount = 0
  ): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await this.delay(this.RATE_LIMIT_DELAY - timeSinceLastRequest);
    }

    const searchParams = new URLSearchParams({
      f: endpoint,
      ...params,
      ...(this.sidToken ? { sid_token: this.sidToken } : {})
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

      const response = await fetch(`${API_BASE}?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Requested-With': 'XMLHttpRequest'
        },
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if ('sid_token' in data && typeof data.sid_token === 'string') {
        this.sidToken = data.sid_token;
        localStorage.setItem('guerrilla_sid_token', this.sidToken);
      }

      this.lastRequestTime = Date.now();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }

        if (retryCount < this.MAX_RETRIES) {
          const delay = Math.min(
            this.RETRY_DELAY * Math.pow(2, retryCount) + Math.random() * 1000,
            this.REQUEST_TIMEOUT
          );
          await this.delay(delay);
          return this.makeRequest(endpoint, params, retryCount + 1);
        }
      }

      throw new Error('Failed to connect to email server. Please try again later.');
    }
  }

  async getEmailAddress(lang = 'en'): Promise<EmailAddress> {
    const savedToken = localStorage.getItem('guerrilla_sid_token');
    if (savedToken) {
      this.sidToken = savedToken;
    }
    return await this.makeRequest<EmailAddress>('get_email_address', { lang });
  }

  async setEmailUser(emailUser: string, lang = 'en'): Promise<EmailAddress> {
    return await this.makeRequest<EmailAddress>('set_email_user', { 
      email_user: emailUser,
      lang 
    });
  }

  async checkEmail(seq = '0'): Promise<EmailList> {
    return await this.makeRequest<EmailList>('check_email', { seq });
  }

  async getEmailList(offset = '0', seq = '0'): Promise<EmailList> {
    return await this.makeRequest<EmailList>('get_email_list', { offset, seq });
  }

  async fetchEmail(emailId: string): Promise<EmailContent> {
    return await this.makeRequest<EmailContent>('fetch_email', { email_id: emailId });
  }

  async forgetMe(emailAddr: string): Promise<EmailAddress> {
    localStorage.removeItem('guerrilla_sid_token');
    const response = await this.makeRequest<EmailAddress>('forget_me', { email_addr: emailAddr });
    this.sidToken = null;
    return response;
  }

  async deleteEmail(emailIds: string[]): Promise<{ deleted_ids: string[] }> {
    const params: Record<string, string> = {};
    emailIds.forEach((id, index) => {
      params[`email_ids[${index}]`] = id;
    });
    return await this.makeRequest('del_email', params);
  }

  generateEmailUser(): string {
    const adjectives = ['happy', 'clever', 'brave', 'bright', 'calm', 'eager', 'fair', 'kind'];
    const nouns = ['tiger', 'eagle', 'wolf', 'bear', 'lion', 'hawk', 'deer', 'fox'];
    
    const getRandomElement = (arr: string[]) => {
      const randomValues = new Uint32Array(1);
      window.crypto.getRandomValues(randomValues);
      return arr[randomValues[0] % arr.length];
    };

    const randomNumber = () => {
      const randomValues = new Uint32Array(1);
      window.crypto.getRandomValues(randomValues);
      return String(randomValues[0] % 1000).padStart(3, '0');
    };

    return `${getRandomElement(adjectives)}${getRandomElement(nouns)}${randomNumber()}`;
  }
}