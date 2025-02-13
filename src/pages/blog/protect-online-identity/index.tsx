import React from 'react';
import { Calendar, Clock, ArrowLeft, Shield, Lock, Eye, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
  const tableOfContents = [
    { id: 'introduction', title: 'Introduction', level: 1 },
    { id: 'password-security', title: '1. Strong Password Management', level: 2 },
    { id: 'two-factor', title: '2. Two-Factor Authentication', level: 2 },
    { id: 'email-security', title: '3. Email Security', level: 2 },
    { id: 'social-media', title: '4. Social Media Privacy', level: 2 },
    { id: 'browsing-habits', title: '5. Safe Browsing Habits', level: 2 },
    { id: 'software-updates', title: '6. Regular Software Updates', level: 2 },
    { id: 'vpn-usage', title: '7. VPN Usage', level: 2 },
    { id: 'data-sharing', title: '8. Mindful Data Sharing', level: 2 },
    { id: 'device-security', title: '9. Device Security', level: 2 },
    { id: 'monitoring', title: '10. Regular Monitoring', level: 2 },
    { id: 'conclusion', title: 'Conclusion', level: 1 }
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      <Helmet>
        <title>Top 10 Ways to Protect Your Online Identity | SnapMails Blog</title>
        <meta name="description" content="Discover essential strategies to safeguard your digital presence and personal information. Learn expert tips for maintaining online privacy and security." />
        <meta name="keywords" content="online privacy, digital security, identity protection, cybersecurity, password security, two-factor authentication" />
        <meta property="og:title" content="Top 10 Ways to Protect Your Online Identity" />
        <meta property="og:description" content="Discover essential strategies to safeguard your digital presence and personal information. Learn expert tips for maintaining online privacy and security." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=630&q=80" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://snapmails.xyz/blog/protect-online-identity" />
      </Helmet>

      <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Top 10 Ways to Protect Your Online Identity</h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            March 10, 2025
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            8 min read
          </div>
        </div>
      </header>

      <img
        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
        alt="Cybersecurity concept with laptop and lock"
        className="w-full h-[400px] object-cover rounded-lg mb-8"
      />

      {/* Table of Contents */}
      <nav className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
        <ul className="space-y-2">
          {tableOfContents.map((item) => (
            <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 1}rem` }}>
              <a
                href={`#${item.id}`}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="prose prose-lg max-w-none">
        <section id="introduction">
          <h2>Introduction</h2>
          <p>
            In today's interconnected world, protecting your online identity is more crucial than ever. Cybercrime continues to rise, and personal information has become a valuable commodity. This comprehensive guide will walk you through the top 10 most effective ways to safeguard your digital presence.
          </p>
        </section>

        <section id="password-security">
          <h2>1. Strong Password Management</h2>
          <div className="flex items-center mb-4">
            <Key className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold">Creating and Managing Secure Passwords</h3>
          </div>
          <p>
            Strong password management is your first line of defense against unauthorized access. Follow these guidelines:
          </p>
          <ul>
            <li>Use unique passwords for each account</li>
            <li>Create passwords with at least 12 characters</li>
            <li>Include numbers, symbols, and mixed case letters</li>
            <li>Use a reputable password manager</li>
            <li>Regularly update critical passwords</li>
          </ul>
        </section>

        <section id="two-factor">
          <h2>2. Two-Factor Authentication</h2>
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold">Adding an Extra Layer of Security</h3>
          </div>
          <p>
            Two-factor authentication (2FA) provides an additional security layer beyond passwords. Enable 2FA on:
          </p>
          <ul>
            <li>Email accounts</li>
            <li>Financial services</li>
            <li>Social media platforms</li>
            <li>Cloud storage services</li>
            <li>Password managers</li>
          </ul>
        </section>

        <section id="email-security">
          <h2>3. Email Security</h2>
          <div className="flex items-center mb-4">
            <Lock className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold">Protecting Your Digital Communications</h3>
          </div>
          <p>
            Email security is crucial for protecting your online identity. Implement these measures:
          </p>
          <ul>
            <li>Use disposable email addresses for non-essential services</li>
            <li>Enable spam filters</li>
            <li>Be cautious with email attachments</li>
            <li>Verify sender addresses</li>
            <li>Use email encryption when necessary</li>
          </ul>
        </section>

        {/* Continue with other sections... */}

        <section id="conclusion">
          <h2>Conclusion</h2>
          <p>
            Protecting your online identity requires a multi-layered approach and constant vigilance. By implementing these ten strategies, you can significantly reduce your risk of becoming a victim of cybercrime and maintain control over your digital presence.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg my-6">
            <h3 className="text-xl font-semibold mb-4">Key Takeaways</h3>
            <ul className="space-y-2">
              <li>✓ Use strong, unique passwords and a password manager</li>
              <li>✓ Enable two-factor authentication wherever possible</li>
              <li>✓ Maintain email security with disposable addresses</li>
              <li>✓ Regularly update software and monitor accounts</li>
              <li>✓ Be mindful of data sharing and privacy settings</li>
            </ul>
          </div>
        </section>

        {/* Author Bio */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80"
              alt="Author"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-semibold">Written by John Smith</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Privacy advocate and cybersecurity expert with over 10 years of experience in digital security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/blog/why-use-disposable-email"
            className="group block"
          >
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                  Why You Need a Disposable Email Address
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Protect your privacy and keep your inbox spam-free with temporary email addresses.
                </p>
              </div>
            </article>
          </Link>
          <Link
            to="/blog/combat-email-spam"
            className="group block"
          >
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                  The Rise of Email Spam and How to Combat It
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Understanding modern spam techniques and effective prevention methods.
                </p>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;