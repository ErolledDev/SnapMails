// Constants
const API_BASE = 'https://api.guerrillamail.com/ajax.php';
const REFRESH_INTERVAL = 15000;
const EMAIL_STORAGE_KEY = 'tempmail_email';
const EMAILS_STORAGE_KEY = 'tempmail_emails';
const DOMAIN_STORAGE_KEY = 'tempmail_domain';
const EMAIL_TIMESTAMP_KEY = 'tempmail_timestamp';
const SESSION_STORAGE_KEY = 'tempmail_session';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// DOM Elements
const emailDisplay = document.getElementById('emailDisplay');
const domainSelect = document.getElementById('domainSelect');
const emailList = document.getElementById('emailList');
const emailContent = document.getElementById('emailContent');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const toast = document.getElementById('toast');

// State
let sidToken = null;
let currentEmail = '';
let emails = [];
let isRefreshing = false;
let lastCheck = 0;
let retryCount = 0;

// Theme Management
function initializeTheme() {
    const isDark = localStorage.getItem('theme') === 'dark' || 
                  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    updateThemeIcon();
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    themeToggle.innerHTML = isDark ? 
        '<svg class="w-5 h-5 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' :
        '<svg class="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
}

// Toast Notifications
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `fixed top-4 right-4 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 transform transition-transform duration-300 ${
        type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    } toast-show`;
    
    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
    }, 3000);
}

// API Functions with retry logic
async function request(endpoint, params = {}, retries = 0) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const searchParams = new URLSearchParams({
            f: endpoint,
            ...params,
            ip: '127.0.0.1',
            agent: navigator.userAgent.substring(0, 160),
            ...(sidToken ? { sid_token: sidToken } : {})
        });

        const response = await fetch(`${API_BASE}?${searchParams}`, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text(); // First get the raw text
        if (!text) {
            throw new Error('Empty response');
        }
        
        const data = JSON.parse(text); // Then parse it
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (data.sid_token) {
            sidToken = data.sid_token;
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ sidToken: data.sid_token }));
        }

        retryCount = 0; // Reset retry count on success
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        
        if (retries < MAX_RETRIES) {
            const delay = RETRY_DELAY * Math.pow(2, retries);
            await new Promise(resolve => setTimeout(resolve, delay));
            return request(endpoint, params, retries + 1);
        }
        
        throw error;
    }
}

async function getEmailAddress() {
    try {
        const response = await request('get_email_address');
        currentEmail = response.email_addr;
        emailDisplay.textContent = currentEmail;
        localStorage.setItem(EMAIL_STORAGE_KEY, currentEmail);
        
        // Clear existing emails when getting a new address
        emails = [];
        renderEmails();
        localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
        
        return response;
    } catch (error) {
        showToast('Failed to get email address', 'error');
        throw error;
    }
}

async function setEmailUser(emailUser) {
    try {
        const response = await request('set_email_user', { email_user: emailUser });
        currentEmail = response.email_addr;
        emailDisplay.textContent = currentEmail;
        localStorage.setItem(EMAIL_STORAGE_KEY, currentEmail);
        
        // Clear existing emails when changing email
        emails = [];
        renderEmails();
        localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
        
        return response;
    } catch (error) {
        showToast('Failed to set email address', 'error');
        throw error;
    }
}

async function checkEmails() {
    if (isRefreshing) return;
    
    try {
        isRefreshing = true;
        const now = Date.now();
        if (now - lastCheck < 5000) return;
        lastCheck = now;

        const response = await request('check_email');
        if (!response || !response.list) {
            throw new Error('Invalid response format');
        }

        const newEmails = response.list.filter(email => 
            !(email.mail_from === 'no-reply@guerrillamail.com' && 
              email.mail_subject.includes('Welcome to Guerrilla Mail'))
        );
        
        // Update emails array with new emails
        const emailMap = new Map(emails.map(email => [email.mail_id, email]));
        newEmails.forEach(email => emailMap.set(email.mail_id, email));
        emails = Array.from(emailMap.values()).sort((a, b) => 
            Number(b.mail_timestamp) - Number(a.mail_timestamp)
        );
        
        renderEmails();
        localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
        
        // Show notification for new emails
        if (newEmails.length > 0) {
            showToast(`Received ${newEmails.length} new email(s)`, 'success');
        }
    } catch (error) {
        console.error('Check emails failed:', error);
        showToast('Failed to check emails', 'error');
    } finally {
        isRefreshing = false;
    }
}

// Rest of the code remains unchanged...

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    initializeTheme();
    
    try {
        // Restore session
        const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (savedSession) {
            try {
                const { sidToken: savedToken } = JSON.parse(savedSession);
                if (savedToken) sidToken = savedToken;
            } catch (e) {
                console.error('Failed to parse saved session:', e);
            }
        }

        // Restore domain
        const savedDomain = localStorage.getItem(DOMAIN_STORAGE_KEY);
        if (savedDomain) domainSelect.value = savedDomain;

        // Restore email and emails
        const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
        if (savedEmail) {
            currentEmail = savedEmail;
            emailDisplay.textContent = currentEmail;
            const savedEmails = localStorage.getItem(EMAILS_STORAGE_KEY);
            if (savedEmails) {
                try {
                    emails = JSON.parse(savedEmails);
                    renderEmails();
                } catch (e) {
                    console.error('Failed to parse saved emails:', e);
                    emails = [];
                }
            }
        } else {
            await getEmailAddress();
        }

        // Start auto-refresh with error handling
        const refreshLoop = () => {
            checkEmails().catch(error => {
                console.error('Auto-refresh failed:', error);
            });
            setTimeout(refreshLoop, REFRESH_INTERVAL);
        };
        
        refreshLoop();
    } catch (error) {
        console.error('Initialization failed:', error);
        showToast('Failed to initialize email service', 'error');
    }
});