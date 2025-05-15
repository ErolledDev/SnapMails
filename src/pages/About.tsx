import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Users, Globe, Mail, Lock, Clock } from 'lucide-react';
import AdUnit from '../components/AdUnit';

export default function About() {
  const stats = [
    { number: '1M+', label: 'Active Users' },
    { number: '10M+', label: 'Emails Protected' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <>
      <Helmet>
        <title>About SnapMails - Leading Temporary Email Service</title>
        <meta name="description" content="Learn about SnapMails, the leading provider of secure temporary email services. Discover our mission, values, and commitment to protecting your privacy online." />
        <meta name="keywords" content="about SnapMails, temporary email service, email privacy, secure email, disposable email provider" />
        <link rel="canonical" href="https://snapmails.xyz/about" />
        
        <meta property="og:title" content="About SnapMails - Leading Temporary Email Service" />
        <meta property="og:description" content="Learn about our mission to protect your email privacy." />
        <meta property="og:url" content="https://snapmails.xyz/about" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:title" content="About SnapMails" />
        <meta name="twitter:description" content="Discover our commitment to email privacy." />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 py-16" role="main">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            About SnapMails
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
            SnapMails is a leading provider of disposable email services, helping millions of users protect their privacy and maintain a clean inbox since 2025.
          </p>
        </div>

        <AdUnit slot="5678901234" className="mb-12" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Privacy First</h3>
            <p className="text-gray-700 dark:text-gray-200">
              Your privacy is our top priority. We never store or share your personal information, ensuring complete anonymity for all users.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Trusted Service</h3>
            <p className="text-gray-700 dark:text-gray-200">
              Millions of users worldwide trust SnapMails for their temporary email needs, making us a leader in disposable email services.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Global Access</h3>
            <p className="text-gray-700 dark:text-gray-200">
              Available worldwide with fast, reliable service. Access your temporary emails from anywhere, anytime.
            </p>
          </div>
        </div>

        <AdUnit slot="6789012345" className="mb-12" />

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Our mission is to provide a secure and reliable temporary email service that helps users protect their privacy online. We believe everyone has the right to control their digital footprint and keep their primary inbox free from spam.
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            We're committed to maintaining the highest standards of security while providing an easy-to-use service that meets the diverse needs of our global user base.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <Lock className="w-5 h-5 text-blue-500 mr-2" />
                Security
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                Advanced encryption and security measures protect your temporary emails.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                Instant Access
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                No registration required - get your temporary email address instantly.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <Mail className="w-5 h-5 text-blue-500 mr-2" />
                Custom Domains
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                Choose from multiple email domains to suit your needs.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 flex items-center">
                <Users className="w-5 h-5 text-blue-500 mr-2" />
                24/7 Support
              </h3>
              <p className="text-gray-700 dark:text-gray-200">
                Dedicated support team ready to help whenever you need assistance.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}