import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      question: "What is SnapMails?",
      answer: "SnapMails is a secure disposable email service that provides temporary email addresses for users who want to protect their primary email from spam and unwanted subscriptions."
    },
    {
      question: "How long do temporary email addresses last?",
      answer: "Email addresses don't expire and remain accessible as long as you maintain your session. However, individual emails are automatically deleted after 1 hour for privacy and security reasons. You can always generate new addresses as needed."
    },
    {
      question: "Can I customize my email address?",
      answer: "Yes! Unlike other temporary email services, SnapMails allows you to customize your email address during your first session. After customization, there's a 60-minute cooldown period before you can customize again."
    },
    {
      question: "Is SnapMails free to use?",
      answer: "Yes, SnapMails is completely free to use. We don't require any registration or payment information."
    },
    {
      question: "How secure is the service?",
      answer: "We take security seriously. All communications are encrypted, and we don't store any personal information. Emails are automatically deleted after 1 hour, and we implement strict security measures to protect your privacy."
    },
    {
      question: "Can I send emails with SnapMails?",
      answer: "SnapMails is designed for receiving emails only. This helps maintain the security and integrity of our service while preventing abuse."
    },
    {
      question: "What email domains are available?",
      answer: "We offer multiple email domains including @guerrillamailblock.com, @sharklasers.com, @guerrillamail.com, and several others. You can switch between domains at any time."
    },
    {
      question: "Will I lose my emails if I close the browser?",
      answer: "Your emails are temporarily cached in your browser session. While you can access them when you return to the same email address, remember that all emails are automatically deleted after 1 hour."
    },
    {
      question: "Can I use this for business purposes?",
      answer: "While SnapMails is great for testing and temporary use, we recommend using a permanent email service for important business communications as emails are deleted after 1 hour."
    },
    {
      question: "What if I receive important emails?",
      answer: "Since this is a temporary email service, we strongly recommend not using it for important communications. Any emails received will be deleted after 1 hour, so make sure to save any important information before then."
    }
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-16" role="main">
      <h1 className="text-center text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 open:shadow-md transition-all duration-300"
          >
            <summary className="flex items-center justify-between cursor-pointer p-6" role="button" aria-expanded="false">
              <h3 className="text-lg font-medium pr-4">{faq.question}</h3>
              <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="px-6 pb-6 text-gray-600">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <a
          href="mailto:support@snapmails.xyz"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          aria-label="Contact Support via Email"
        >
          Contact Support
        </a>
      </div>
    </main>
  );
}