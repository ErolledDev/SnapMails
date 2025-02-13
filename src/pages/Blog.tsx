import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Why You Need a Disposable Email Address for Online Privacy',
    excerpt: 'Learn how temporary email addresses can protect your privacy and keep your main inbox spam-free.',
    date: 'March 15, 2025',
    readTime: '5 min read',
    slug: 'why-use-disposable-email',
    category: 'Privacy'
  },
  {
    id: '2',
    title: 'Top 10 Ways to Protect Your Online Identity',
    excerpt: 'Discover essential strategies to safeguard your digital presence and personal information.',
    date: 'March 10, 2025',
    readTime: '8 min read',
    slug: 'protect-online-identity',
    category: 'Security'
  },
  {
    id: '3',
    title: 'The Rise of Email Spam and How to Combat It',
    excerpt: 'Understanding modern spam techniques and effective methods to keep your inbox clean.',
    date: 'March 5, 2025',
    readTime: '6 min read',
    slug: 'combat-email-spam',
    category: 'Email Security'
  }
];

const Blog: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
          Privacy & Security Blog
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
          Stay informed about email privacy, cybersecurity, and best practices for protecting your digital identity.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime}
                </div>
              </div>
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Read more
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Want to stay updated? Subscribe to our newsletter for the latest privacy tips and security news.
        </p>
        <form className="max-w-lg mx-auto">
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Blog;