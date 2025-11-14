import React from 'react';
import { Helmet } from 'react-helmet-async';
import EmailBox from '../components/EmailBox';
import AdUnit from '../components/AdUnit';
import { Shield, Clock, Lock, Mail } from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';

const Home: React.FC = () => {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>Free Temporary Email - Disposable Temp Mail Service | SnapMails</title>
        <meta name="description" content="Create instant disposable email addresses with SnapMails. Protect your privacy with our secure temporary email service. No registration required, custom domains available." />
        <meta name="keywords" content="temporary email, disposable email, temp mail, anonymous email, spam protection, custom email, temporary mail service, secure email, free temp mail" />
        <link rel="canonical" href="https://snapmails.xyz" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Temporary Email - Disposable Temp Mail Service | SnapMails" />
        <meta property="og:description" content="Create instant disposable email addresses with SnapMails. Protect your privacy with our secure temporary email service. No registration required, custom domains available." />
        <meta property="og:url" content="https://snapmails.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://snapmails.xyz/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="SnapMails" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Temporary Email - Disposable Temp Mail Service | SnapMails" />
        <meta name="twitter:description" content="Create instant disposable email addresses with SnapMails. Protect your privacy with our secure temporary email service." />
        <meta name="twitter:image" content="https://snapmails.xyz/twitter-image.jpg" />
        <meta name="twitter:site" content="@snapmails" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="SnapMails" />
        <meta name="copyright" content="SnapMails" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "SnapMails",
            "description": "Create instant disposable email addresses with SnapMails. Protect your privacy with our secure temporary email service.",
            "url": "https://snapmails.xyz",
            "applicationCategory": "Email Service",
            "operatingSystem": "All",
            "browserRequirements": "Requires JavaScript",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Instant temporary email addresses",
              "Custom domain selection",
              "No registration required",
              "Real-time email notifications",
              "Secure and private"
            ],
            "screenshot": {
              "@type": "ImageObject",
              "url": "https://snapmails.xyz/desktop-view.jpg",
              "caption": "SnapMails desktop interface"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250",
              "bestRating": "5",
              "worstRating": "1"
            }
          })}
        </script>
      </Helmet>

      <div className="relative bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 dark:from-blue-950/30 dark:via-gray-900 dark:to-blue-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600">
              Free Temporary Email Service
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-100 mb-4 leading-relaxed">
              Create instant disposable email addresses with unique customization features
            </p>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Get a free temporary email address instantly. No registration required. Perfect for protecting your privacy, avoiding spam, and testing services safely.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit
          slot="1234567890"
          format="auto"
          position="top"
          className="py-8 sm:py-12"
        />

        <div className="py-8 sm:py-12">
          <ErrorBoundary>
            <EmailBox />
          </ErrorBoundary>
        </div>

        <AdUnit
          slot="0987654321"
          format="auto"
          position="bottom"
          className="py-8 sm:py-12"
        />

        <section className="py-16 sm:py-20 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Keep your real email address private and protect yourself from unwanted spam and marketing emails.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get a temporary email address instantly - no registration or personal information required.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our service is built with security in mind, ensuring your temporary emails are protected.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Receive an instant temporary email address
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Use it to sign up for services or receive emails
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Instantly receive and read your messages
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">4</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Keep your real inbox clean and protected
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Choose from multiple email domains to suit your needs. Switch between domains anytime.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Receive instant notifications when new emails arrive. No refresh needed.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Access your temporary emails on any device with our responsive design.
              </p>
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
};

export default Home;