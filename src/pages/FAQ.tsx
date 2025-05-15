import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, HelpCircle } from 'lucide-react';
import AdUnit from '../components/AdUnit';

export default function FAQ() {
  const faqs = [
    {
      question: "What is SnapMails and how does it work?",
      answer: "SnapMails is a secure disposable email service that provides temporary email addresses. When you visit our site, you instantly receive a temporary email address that you can use to sign up for services, receive verification codes, or protect your primary email from spam. The service automatically checks for new emails and displays them in real-time, with no registration required."
    },
    {
      question: "How long do temporary email addresses last?",
      answer: "Your temporary email address remains active as long as you keep the browser window open or until you manually generate a new address. Emails received are automatically deleted after 1 hour for security purposes. We recommend saving any important information before this time limit. You can always generate a new address whenever you need one."
    },
    {
      question: "Can I customize my email address?",
      answer: "Yes! Unlike many other temporary email services, SnapMails allows you to customize both the username and domain of your temporary email address. You can choose from multiple available domains and set a custom username that suits your needs. After customization, there's a brief cooldown period before you can customize again to prevent abuse."
    },
    {
      question: "Is SnapMails completely free to use?",
      answer: "Yes, SnapMails is entirely free to use. We don't require any registration, payment information, or personal details. All features, including custom email addresses, multiple domains, and real-time email checking, are available to all users at no cost. We maintain our service through minimal, non-intrusive advertising."
    },
    {
      question: "How secure is the SnapMails service?",
      answer: "Security is our top priority. We implement multiple layers of protection including encrypted connections (HTTPS), automatic email deletion after 1 hour, no permanent storage of messages, and strict security policies. We never collect personal information and ensure that your temporary email usage remains private and secure."
    },
    {
      question: "Can I send emails with SnapMails?",
      answer: "SnapMails is designed specifically for receiving emails only. This limitation helps maintain the security and integrity of our service while preventing abuse. For sending emails, we recommend using your regular email service. Our focus is on providing a secure, temporary inbox for receiving messages."
    },
    {
      question: "What email domains are available?",
      answer: "We offer multiple email domains including @sharklasers.com, @guerrillamailblock.com, @guerrillamail.com, @guerrillamail.net, @guerrillamail.org, and several others. You can switch between domains at any time through the domain selector in the interface. Each domain is fully functional and maintained for reliability."
    },
    {
      question: "Will I lose my emails if I close my browser?",
      answer: "Yes, since SnapMails is a temporary service, emails are only stored in your browser session. When you close your browser, the session ends and the emails are cleared for privacy. Additionally, all emails are automatically deleted after 1 hour, even if you keep the browser open. We recommend saving any important information before closing your browser."
    },
    {
      question: "Is SnapMails suitable for business use?",
      answer: "While SnapMails is excellent for testing, development, and temporary needs, we recommend using a permanent email service for important business communications. Our service is ideal for situations like testing application email functionality, signing up for newsletters, or temporary access to services, but not for long-term business correspondence."
    },
    {
      question: "How do I handle important emails I receive?",
      answer: "Since SnapMails is a temporary service with a 1-hour email retention policy, we strongly recommend: 1) Checking emails promptly when expecting important messages, 2) Saving or forwarding critical information to a permanent email address, 3) Taking screenshots or notes of important details, and 4) Using a permanent email service for crucial communications."
    },
    {
      question: "Can I access my temporary email from multiple devices?",
      answer: "Each temporary email address is session-based and device-specific. While you can't synchronize the same address across devices, you can easily generate new temporary addresses on each device. This approach maintains security and ensures a clean separation between different sessions."
    },
    {
  "question": "Can I use my personalized email address permanently?",
  "answer": "No. You can choose your favorite name for your temporary email address, but it is not permanent. Email messages are temporary and are not saved between sessions."
},
    {
      question: "What should I do if I don't receive an expected email?",
      answer: "If you're not receiving expected emails: 1) Check if the sender has the correct email address, 2) Verify that the email wasn't automatically filtered, 3) Use the refresh button to manually check for new messages, 4) Consider using a different domain if certain senders are blocked, 5) Contact our support if problems persist."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions - SnapMails Temporary Email Service</title>
        <meta name="description" content="Get answers to common questions about SnapMails' temporary email service. Learn about our features, security measures, and how to make the most of our disposable email addresses." />
        <meta name="keywords" content="temporary email FAQ, disposable email help, email privacy questions, SnapMails support, temp mail guide" />
        <link rel="canonical" href="https://snapmails.xyz/faq" />
        
        <meta property="og:title" content="SnapMails FAQ - Comprehensive Guide to Our Service" />
        <meta property="og:description" content="Find detailed answers to common questions about our temporary email service." />
        <meta property="og:url" content="https://snapmails.xyz/faq" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:title" content="SnapMails FAQ - Get Help" />
        <meta name="twitter:description" content="Complete guide to using our temporary email service." />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 py-16" role="main">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            Find answers to common questions about SnapMails' temporary email service. Learn how to make the most of our features and protect your privacy.
          </p>
        </div>

        <AdUnit slot="2345678901" className="mb-12" />
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6" role="button" aria-expanded="false">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white pr-4">{faq.question}</h2>
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="px-6 pb-6 text-gray-700 dark:text-gray-200">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <AdUnit slot="3456789012" className="my-12" />

        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
            Still Have Questions?
          </h2>
          <p className="text-gray-700 dark:text-gray-200 text-center mb-6">
            Our support team is here to help you with any questions or concerns about our temporary email service.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:support@snapmails.xyz"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              aria-label="Contact Support via Email"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </>
  );
}