import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Clock, Lock, RefreshCw, Mail, Zap, Edit2, Globe } from 'lucide-react';
import AdUnit from '../components/AdUnit';

export default function Features() {
  const features = [
    {
      icon: <Edit2 className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Customizable Email",
      description: "Unlike other services, we let you customize your temporary email address anytime you want. Choose your preferred username and domain to create a personalized disposable email that suits your needs."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Privacy Protection",
      description: "Keep your real email address private and protect yourself from spam and unwanted subscriptions. Our service ensures your personal information stays secure while handling temporary communications."
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Instant Access",
      description: "Get a temporary email address immediately with no registration or personal information required. Start receiving emails instantly with our efficient and user-friendly service."
    },
    {
      icon: <Lock className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Secure Service",
      description: "Our service is built with security in mind, ensuring your temporary emails are protected. We use encryption and follow best practices to maintain the privacy of your communications."
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Auto Refresh",
      description: "Emails are automatically checked and displayed in real-time as they arrive. Never miss an important message with our instant notification system and auto-refresh functionality."
    },
    {
      icon: <Mail className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Clean Interface",
      description: "User-friendly design makes it easy to read and manage your temporary emails. Our intuitive interface ensures you can quickly access and organize your messages."
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Fast & Reliable",
      description: "High-performance infrastructure ensures your temporary email service is always available. Experience quick email delivery and consistent service reliability."
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Multiple Domains",
      description: "Choose from different email domains to suit your needs and preferences. Switch between domains easily to maintain flexibility and avoid domain-based restrictions."
    }
  ];

  return (
    <>
      <Helmet>
        <title>SnapMails Features - Secure Temporary Email Service</title>
        <meta name="description" content="Discover SnapMails' powerful features including customizable addresses, instant access, and enhanced privacy protection. Try our secure temporary email service today." />
        <meta name="keywords" content="temporary email features, disposable email service, email privacy, custom email address, secure email" />
        <link rel="canonical" href="https://snapmails.xyz/features" />
        
        <meta property="og:title" content="SnapMails Features - Secure Temporary Email Service" />
        <meta property="og:description" content="Discover our powerful features for secure temporary email." />
        <meta property="og:url" content="https://snapmails.xyz/features" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:title" content="SnapMails Features" />
        <meta name="twitter:description" content="Explore our comprehensive temporary email features." />
      </Helmet>

      <main className="max-w-7xl mx-auto px-4 py-16" role="main">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Powerful Features for Your Privacy
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover what makes SnapMails the most versatile and secure temporary email service available.
            Our comprehensive feature set ensures your privacy while providing a seamless experience.
          </p>
        </div>

        <AdUnit slot="3456789012" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              role="listitem"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <AdUnit slot="4567890123" className="my-12" />

        <section className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Ready to protect your privacy?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SnapMails for their temporary email needs.
            Experience the most secure and feature-rich disposable email service available today.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            aria-label="Get started with SnapMails"
          >
            Get Started Now
          </a>
        </section>
      </main>
    </>
  );
}