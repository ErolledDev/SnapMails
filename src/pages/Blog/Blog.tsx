import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  slug: string;
  author: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Why Snapmails Beats Every Other Temporary Email Service (Customization Wins!)',
    excerpt: 'Discover how Snapmails revolutionizes disposable email with unmatched customization features. Learn why users are switching from traditional temp mail services.',
    date: 'Mar 15, 2025',
    readTime: '8 min read',
    category: 'Features',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=1600',
    slug: 'snapmails-beats-competition',
    author: 'Alex Chen'
  },
  {
    id: '2',
    title: 'Temporary Emails, But Better: How Snapmails\' Custom Features Outperform the Rest',
    excerpt: 'An in-depth look at how Snapmails\' innovative customization features are changing the game in temporary email services.',
    date: 'Mar 14, 2025',
    readTime: '6 min read',
    category: 'Comparison',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1600',
    slug: 'custom-features-comparison',
    author: 'Sarah Miller'
  },
  {
    id: '3',
    title: 'Snapmails vs. Disposable Email Services: Why Customization is the Future',
    excerpt: 'A detailed comparison of Snapmails against traditional disposable email services. See why customization is becoming essential.',
    date: 'Mar 13, 2025',
    readTime: '10 min read',
    category: 'Analysis',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600',
    slug: 'customization-future',
    author: 'Michael Torres'
  },
  {
    id: '4',
    title: '5 Ways Snapmails\' Customizable Temporary Emails Outshine the Competition',
    excerpt: 'Explore the five key features that make Snapmails the superior choice for temporary email needs.',
    date: 'Mar 12, 2025',
    readTime: '7 min read',
    category: 'Features',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=1600',
    slug: 'five-ways-snapmails-wins',
    author: 'Emma Wilson'
  },
  {
    id: '5',
    title: 'The Ultimate Guide to Customizable Temporary Emails (Why Snapmails Leads the Pack)',
    excerpt: 'Everything you need to know about modern temporary email services and why Snapmails is leading the innovation.',
    date: 'Mar 11, 2025',
    readTime: '12 min read',
    category: 'Guide',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1600',
    slug: 'ultimate-guide',
    author: 'David Park'
  },
  {
    id: '6',
    title: 'Why Generic Temporary Emails Are Dead: Snapmails\' Custom Features Explained',
    excerpt: 'The era of generic disposable emails is over. Learn how Snapmails is revolutionizing temporary email services.',
    date: 'Mar 10, 2025',
    readTime: '9 min read',
    category: 'Analysis',
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&q=80&w=1600',
    slug: 'generic-emails-dead',
    author: 'Lisa Chen'
  },
  {
    id: '7',
    title: 'Snapmails vs. 10MinuteMail: Why Customization is the Game-Changer You Need',
    excerpt: 'A head-to-head comparison between Snapmails and 10MinuteMail. See why customization makes all the difference.',
    date: 'Mar 9, 2025',
    readTime: '8 min read',
    category: 'Comparison',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600',
    slug: 'snapmails-vs-10minutemail',
    author: 'James Wilson'
  },
  {
    id: '8',
    title: 'How Snapmails\' Customizable Temporary Emails Solve Problems Other Services Can\'t',
    excerpt: 'Discover the unique solutions that only Snapmails\' customizable temporary email service can provide.',
    date: 'Mar 8, 2025',
    readTime: '7 min read',
    category: 'Solutions',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1600',
    slug: 'solving-unique-problems',
    author: 'Rachel Kim'
  },
  {
    id: '9',
    title: 'The Rise of Customizable Temporary Emails: Why Snapmails is Leading the Charge',
    excerpt: 'An analysis of the growing trend in customizable temporary emails and how Snapmails is shaping the future.',
    date: 'Mar 7, 2025',
    readTime: '11 min read',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600',
    slug: 'rise-of-customization',
    author: 'Thomas Lee'
  },
  {
    id: '10',
    title: 'Why Snapmails is the Only Temporary Email Service You\'ll Ever Need (Customization FTW!)',
    excerpt: 'From basic to advanced features, discover why Snapmails is the complete solution for all your temporary email needs.',
    date: 'Mar 6, 2025',
    readTime: '9 min read',
    category: 'Features',
    image: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&q=80&w=1600',
    slug: 'complete-email-solution',
    author: 'Sophie Martinez'
  }
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(blogPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Featured Post */}
      <div className="mb-12">
        <Link to={`/blog/${featuredPost.slug}`} className="block group">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {featuredPost.date}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {featuredPost.readTime}
            </span>
            <span className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              {featuredPost.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {featuredPost.title}
          </h2>
          <p className="text-gray-600">{featuredPost.excerpt}</p>
        </Link>
      </div>

      {/* All Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {regularPosts.map((post) => (
          <article key={post.id} className="group">
            <Link to={`/blog/${post.slug}`}>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {post.date}
                </span>
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {post.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>

      {/* Popular Posts Sidebar */}
      <aside className="mt-12 lg:mt-0 lg:col-span-1">
        <div className="sticky top-8">
          <h2 className="text-lg font-bold mb-6">Popular Posts</h2>
          <div className="space-y-6">
            {posts.slice(0, 5).map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-4 group">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.category}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Ads Section */}
      <div className="mt-12 bg-pink-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">ads here</p>
      </div>
    </div>
  );
}