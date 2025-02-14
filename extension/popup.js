import { GuerrillaClient } from './guerrilla.js';

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
};

class EmailApp {
  constructor() {
    this.client = new GuerrillaClient();
    this.emails = [];
    this.selectedEmail = null;
    this.emailAddress = '';
    this.selectedDomain = 'sharklasers';
    this.init();
  }

  async init() {
    this.renderApp();
    await this.initializeEmail();
    this.startAutoRefresh();
  }

  async initializeEmail() {
    try {
      const response = await this.client.getEmailAddress();
      this.emailAddress = response.email_addr;
      this.renderEmailAddress();
      await this.checkEmails();
    } catch (error) {
      console.error('Failed to initialize email:', error);
      this.showError('Failed to initialize email. Please try again.');
    }
  }

  startAutoRefresh() {
    setInterval(() => this.checkEmails(), 15000);
  }

  async checkEmails() {
    try {
      const response = await this.client.checkEmail();
      this.emails = response.list.sort((a, b) => 
        Number(b.mail_timestamp) - Number(a.mail_timestamp)
      );
      this.renderEmails();
    } catch (error) {
      console.error('Failed to check emails:', error);
    }
  }

  async handleEmailClick(email) {
    try {
      const fullEmail = await this.client.fetchEmail(email.mail_id);
      this.selectedEmail = { ...email, mail_body: fullEmail.mail_body };
      this.renderSelectedEmail();
    } catch (error) {
      console.error('Failed to fetch email:', error);
      this.showError('Failed to fetch email content. Please try again.');
    }
  }

  async handleDomainChange(domain) {
    try {
      this.selectedDomain = domain;
      const username = this.emailAddress.split('@')[0];
      const response = await this.client.setEmailUser(username);
      this.emailAddress = response.email_addr;
      this.renderEmailAddress();
      await this.checkEmails();
    } catch (error) {
      console.error('Failed to change domain:', error);
      this.showError('Failed to change email domain. Please try again.');
    }
  }

  copyEmailAddress() {
    navigator.clipboard.writeText(this.emailAddress);
    this.showCopiedMessage();
  }

  showCopiedMessage() {
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg animate-fade-in-out';
    message.textContent = 'Copied!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
  }

  showError(message) {
    const error = document.createElement('div');
    error.className = 'fixed top-4 right-4 bg-red-500 text-white text-xs py-1 px-2 rounded shadow-lg animate-fade-in-out';
    error.textContent = message;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 3000);
  }

  renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="h-full flex flex-col">
        <div class="p-4 border-b">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-gray-600">Your temporary email address:</div>
            <button 
              id="copyButton"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy email address"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
          <div id="emailAddress" class="font-mono text-lg mb-2"></div>
          <select
            id="domainSelect"
            class="block w-64 appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm"
          >
            ${Object.entries(EMAIL_DOMAINS).map(([key, domain]) => `
              <option value="${key}"${key === this.selectedDomain ? ' selected' : ''}>
                ${domain}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="flex-1 overflow-hidden grid grid-cols-1">
          <div id="emailList" class="border-r overflow-y-auto"></div>
          <div id="emailContent" class="overflow-y-auto p-4"></div>
        </div>
      </div>
    `;

    // Event Listeners
    document.getElementById('copyButton').addEventListener('click', () => this.copyEmailAddress());
    document.getElementById('domainSelect').addEventListener('change', (e) => this.handleDomainChange(e.target.value));
  }

  renderEmailAddress() {
    const emailAddressElement = document.getElementById('emailAddress');
    emailAddressElement.textContent = this.emailAddress;
  }

  renderEmails() {
    const emailList = document.getElementById('emailList');
    if (this.emails.length === 0) {
      emailList.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <p>No emails yet</p>
          <p class="text-sm text-gray-400 mt-2">Checking for new emails automatically...</p>
        </div>
      `;
      return;
    }

    emailList.innerHTML = this.emails.map(email => `
      <button
        class="w-full p-4 text-left hover:bg-gray-50 transition-colors ${
          this.selectedEmail?.mail_id === email.mail_id ? 'bg-blue-50' : ''
        }"
        data-email-id="${email.mail_id}"
      >
        <div class="flex justify-between items-start mb-1">
          <div class="font-medium truncate flex-1">${email.mail_from}</div>
          <div class="text-sm text-gray-500 ml-2">${email.mail_date}</div>
        </div>
        <div class="text-sm font-medium truncate mb-1">${email.mail_subject}</div>
        <div class="text-sm text-gray-600 truncate">${email.mail_excerpt}</div>
      </button>
    `).join('');

    // Add click listeners to email items
    emailList.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const emailId = button.dataset.emailId;
        const email = this.emails.find(e => e.mail_id === emailId);
        if (email) {
          this.handleEmailClick(email);
        }
      });
    });
  }

  renderSelectedEmail() {
    const emailContent = document.getElementById('emailContent');
    if (!this.selectedEmail) {
      emailContent.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <p>Select an email to read</p>
        </div>
      `;
      return;
    }

    emailContent.innerHTML = `
      <div class="mb-4">
        <div class="font-medium mb-2">${this.selectedEmail.mail_subject}</div>
        <div class="text-sm text-gray-600 mb-1">From: ${this.selectedEmail.mail_from}</div>
        <div class="text-sm text-gray-600">Date: ${this.selectedEmail.mail_date}</div>
      </div>
      <div class="prose max-w-none">
        ${this.selectedEmail.mail_body}
      </div>
    `;
  }
}

// Initialize the app when the popup loads
document.addEventListener('DOMContentLoaded', () => {
  new EmailApp();
});