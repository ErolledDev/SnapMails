import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg">
        <p className="lead text-xl text-gray-600 mb-8">
          By using TempMail Pro, you agree to these terms of service. Please read them carefully.
        </p>

        <h2>1. Service Description</h2>
        <p>
          TempMail Pro provides temporary, disposable email addresses for receiving emails. The service is provided "as is" without any warranties.
        </p>

        <h2>2. Acceptable Use</h2>
        <p>
          You agree not to use TempMail Pro for:
        </p>
        <ul>
          <li>Illegal activities</li>
          <li>Spam or harassment</li>
          <li>Distribution of malware</li>
          <li>Phishing or fraud</li>
          <li>Violation of others' rights</li>
        </ul>

        <h2>3. Service Limitations</h2>
        <p>
          We reserve the right to:
        </p>
        <ul>
          <li>Modify or terminate the service at any time</li>
          <li>Block any user or IP address</li>
          <li>Delete any email content</li>
          <li>Limit service usage</li>
        </ul>

        <h2>4. Disclaimer of Warranties</h2>
        <p>
          The service is provided on an "as is" and "as available" basis. We make no warranties about the reliability, availability, or accuracy of the service.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
        </p>

        <h2>6. Changes to Terms</h2>
        <p>
          We may modify these terms at any time. Continued use of the service constitutes acceptance of the new terms.
        </p>

        <h2>7. Contact Information</h2>
        <p>
          For questions about these terms, please contact us at legal@tempmailpro.com.
        </p>

        <p className="text-sm text-gray-600 mt-8">
          Last updated: March 2025
        </p>
      </div>
    </div>
  );
}