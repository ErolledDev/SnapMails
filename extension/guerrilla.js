// Guerrilla Mail API Client
const API_BASE = 'https://api.guerrillamail.com/ajax.php';

export class GuerrillaClient {
  constructor() {
    this.sidToken = null;
    this.lastRequestTime = 0;
    this.RATE_LIMIT_DELAY = 1000;
    this.REQUEST_TIMEOUT = 30000;
    this.MAX_RETRIES = 3;
    this.RETRY_DELAY = 1000;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRequest(endpoint, params = {}, retryCount = 0) {
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

      const response = await fetch(`${API_BASE}?${searchParams}`, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
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

  async getEmailAddress(lang = 'en') {
    return await this.makeRequest('get_email_address', { lang });
  }

  async setEmailUser(emailUser, lang = 'en') {
    return await this.makeRequest('set_email_user', { 
      email_user: emailUser,
      lang 
    });
  }

  async checkEmail(seq = '0') {
    return await this.makeRequest('check_email', { seq });
  }

  async fetchEmail(emailId) {
    return await this.makeRequest('fetch_email', { email_id: emailId });
  }

  generateEmailUser() {
    const adjectives = ['happy', 'clever', 'brave', 'bright', 'calm', 'eager', 'fair', 'kind'];
    const nouns = ['tiger', 'eagle', 'wolf', 'bear', 'lion', 'hawk', 'deer', 'fox'];
    
    const getRandomElement = (arr) => {
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