import React from 'react';
import { Shield, Lock, Eye, Database, Clock, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - SnapMails | Your Data Protection & Security</title>
        <meta name="description" content="Read SnapMails' privacy policy to understand how we protect your data. Learn about our commitment to privacy, data handling practices, and security measures." />
        <meta property="og:title" content="Privacy Policy - SnapMails | Your Data Protection & Security" />
        <meta property="og:description" content="Read SnapMails' privacy policy to understand how we protect your data. Learn about our commitment to privacy, data handling practices, and security measures." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://snapmails.xyz/privacy" />
        <link rel="canonical" href="https://snapmails.xyz/privacy" />
      </Helmet>
      
      <main className="max-w-4xl mx-auto px-4 py-16" role="main">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            At SnapMails, protecting your privacy is our top priority. This comprehensive Privacy Policy explains how we collect, use, and safeguard your information.
          </p>

          <section className="mb-12" aria-labelledby="info-collect">
            <div className="flex items-center mb-4">
              <h2 id="info-collect" className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We collect minimal information necessary to provide our temporary email service:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Temporary email addresses generated during your session
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Email messages received during your active session
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Basic usage statistics for service improvement
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Technical information (browser type, device type, IP address)
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="info-use">
            <div className="flex items-center mb-4">
              <h2 id="info-use" className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your information is used exclusively for:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Providing temporary email services
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Maintaining and improving our service quality
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Preventing abuse and ensuring system security
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Analyzing service performance and user experience
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="data-retention">
            <div className="flex items-center mb-4">
              <h2 id="data-retention" className="text-2xl font-bold text-gray-900 dark:text-white">Data Retention</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We maintain strict data retention policies:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Temporary email addresses are automatically deleted after 24 hours
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Email messages are automatically deleted after 1 hour
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Usage logs are anonymized and deleted after 7 days
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  No permanent records of email content or addresses are maintained
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="info-sharing">
            <div className="flex items-center mb-4">
              <h2 id="info-sharing" className="text-2xl font-bold text-gray-900 dark:text-white">Information Sharing</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We have a strict no-sharing policy:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  We never sell, trade, or transfer your information to third parties
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Anonymous usage statistics may be shared for service improvement
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  We may share information if required by law or to protect our rights
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="security">
            <div className="flex items-center mb-4">
              <h2 id="security" className="text-2xl font-bold text-gray-900 dark:text-white">Security Measures</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We implement robust security measures:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  End-to-end encryption for all data transmission
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Regular security audits and vulnerability assessments
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Advanced DDoS protection and firewall systems
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Secure data storage with encryption at rest
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="cookies">
            <div className="flex items-center mb-4">
              <h2 id="cookies" className="text-2xl font-bold text-gray-900 dark:text-white">Cookies & Tracking</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our cookie usage is minimal:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Essential cookies only for session management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  No tracking or advertising cookies
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Cookies are automatically deleted when you close your browser
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12" aria-labelledby="changes">
            <h2 id="changes" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this privacy policy periodically. We will notify users of any material changes by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          <section aria-labelledby="contact">
            <h2 id="contact" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a 
                href="mailto:privacy@snapmails.xyz" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                aria-label="Contact privacy team via email"
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