import React from 'react';

export default function Privacy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16" role="main">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        <p className="lead text-xl text-gray-600 mb-8">
          At SnapMails, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information.
        </p>

        <section aria-labelledby="info-collect">
          <h2 id="info-collect">Information We Collect</h2>
          <p>
            We collect minimal information necessary to provide our temporary email service:
          </p>
          <ul role="list">
            <li>Temporary email addresses generated</li>
            <li>Email messages received during the session</li>
            <li>Basic usage statistics</li>
          </ul>
        </section>

        <section aria-labelledby="info-use">
          <h2 id="info-use">How We Use Your Information</h2>
          <p>
            The information we collect is used solely to:
          </p>
          <ul role="list">
            <li>Provide temporary email services</li>
            <li>Maintain and improve our service</li>
            <li>Prevent abuse of our system</li>
          </ul>
        </section>

        <section aria-labelledby="data-retention">
          <h2 id="data-retention">Data Retention</h2>
          <p>
            All temporary email addresses and messages are automatically deleted after 24 hours. We do not maintain any permanent records of email content or addresses.
          </p>
        </section>

        <section aria-labelledby="info-sharing">
          <h2 id="info-sharing">Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your information to third parties. We may share anonymous usage statistics for service improvement purposes.
          </p>
        </section>

        <section aria-labelledby="security">
          <h2 id="security">Security</h2>
          <p>
            We implement industry-standard security measures to protect your information during transmission and storage.
          </p>
        </section>

        <section aria-labelledby="cookies">
          <h2 id="cookies">Cookies</h2>
          <p>
            We use essential cookies to maintain your session and provide our service. These cookies are temporary and are deleted when you close your browser.
          </p>
        </section>

        <section aria-labelledby="changes">
          <h2 id="changes">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify users of any material changes by posting the new policy on this page.
          </p>
        </section>

        <section aria-labelledby="contact">
          <h2 id="contact">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@snapmails.xyz" aria-label="Contact privacy team via email">
              privacy@snapmails.xyz
            </a>
            .
          </p>
        </section>

        <p className="text-sm text-gray-600 mt-8">
          Last updated: March 2025
        </p>
      </div>
    </main>
  );
}