import React from 'react';
import { Shield, AlertTriangle, FileText, Scale, Clock, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - SnapMails | Usage Guidelines & Policies</title>
        <meta name="description" content="Review SnapMails' terms of service. Understand our usage guidelines, policies, and service terms for our free temporary email service." />
        <meta property="og:title" content="Terms of Service - SnapMails | Usage Guidelines & Policies" />
        <meta property="og:description" content="Review SnapMails' terms of service. Understand our usage guidelines, policies, and service terms for our free temporary email service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://snapmails.xyz/terms" />
        <link rel="canonical" href="https://snapmails.xyz/terms" />
      </Helmet>
      
      <main className="max-w-4xl mx-auto px-4 py-16" role="main">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Terms of Service</h1>
        
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            By using SnapMails, you agree to these comprehensive terms of service. Please read them carefully as they govern your use of our service.
          </p>

          <section className="mb-12" aria-labelledby="service-description">
            <div className="flex items-center mb-4">
              <h2 id="service-description" className="text-2xl font-bold text-gray-900 dark:text-white">1. Service Description</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                SnapMails provides:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Temporary, disposable email addresses for receiving emails
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Automatic email deletion after 1 hour
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Multiple domain options
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Real-time email reception
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="acceptable-use">
            <div className="flex items-center mb-4">
              <h2 id="acceptable-use" className="text-2xl font-bold text-gray-900 dark:text-white">2. Acceptable Use</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You agree not to use SnapMails for:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Any illegal activities or purposes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Sending spam or harassment
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Distribution of malware or harmful content
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Phishing, fraud, or deceptive practices
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Violation of others' intellectual property rights
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Automated or bulk email operations
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="limitations">
            <div className="flex items-center mb-4">
              <h2 id="limitations" className="text-2xl font-bold text-gray-900 dark:text-white">3. Service Limitations</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We reserve the right to:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Modify or terminate the service at any time
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Block any user or IP address without notice
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Delete any email content or address
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Limit service usage or features
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Modify service features or functionality
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="disclaimer">
            <div className="flex items-center mb-4">
              <h2 id="disclaimer" className="text-2xl font-bold text-gray-900 dark:text-white">4. Disclaimer of Warranties</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300">
                The service is provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Reliability or availability
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Security or accuracy
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Fitness for a particular purpose
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Non-infringement of third-party rights
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="liability">
            <div className="flex items-center mb-4">
              <h2 id="liability" className="text-2xl font-bold text-gray-900 dark:text-white">5. Limitation of Liability</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We shall not be liable for any:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Direct, indirect, or consequential damages
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Loss of data or privacy
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Business interruption or financial loss
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Personal injury or property damage
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="changes">
            <div className="flex items-center mb-4">
              <h2 id="changes" className="text-2xl font-bold text-gray-900 dark:text-white">6. Changes to Terms</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300">
                We may modify these terms at any time. Your continued use of the service after any changes constitutes acceptance of the new terms. Major changes will be announced on our website.
              </p>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="termination">
            <h2 id="termination" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Account Termination</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including breach of these Terms.
              </p>
            </div>
          </section>

          <section aria-labelledby="contact">
            <h2 id="contact" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300">
              For questions about these terms, please contact us at{' '}
              <a 
                href="mailto:legal@snapmails.xyz"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                aria-label="Contact legal team via email"
              >
               erolledph@gmail.com
              </a>
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: March 2025
            </p>
          </div>
        </div>
      </main>
    </>
  );
}