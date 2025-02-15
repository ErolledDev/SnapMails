import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';

export default function BlogPost() {
  const post = {
    title: 'The 6 Worst Interior Design Jobs in History',
    date: 'Oct 25',
    category: 'Decor',
    author: 'Sarah Chen',
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=1600'
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation */}
      <Link 
        to="/blog" 
        className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {post.date}
          </span>
          <span className="flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            {post.category}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
              alt={post.author}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-600">Interior Design Expert</p>
            </div>
          </div>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Share article"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Featured Image */}
      <img
        src={post.image}
        alt="Interior Design Example"
        className="w-full aspect-[16/9] object-cover rounded-2xl mb-8"
      />

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl">
          How hollywood got apartment guides all wrong. The complete beginner's guide to interior design ideas.
        </p>

        <h2>Introduction</h2>
        <p>
          Interior design is more than just arranging furniture and choosing colors. It's about creating 
          functional, aesthetically pleasing spaces that enhance people's lives. However, throughout history, 
          there have been some notable mishaps in the world of interior design.
        </p>

        <h2>The Victorian Era Excess</h2>
        <p>
          While the Victorian era is known for its ornate designs, some interiors went too far with:
        </p>
        <ul>
          <li>Overwhelming patterns and textures</li>
          <li>Excessive use of heavy drapery</li>
          <li>Cluttered spaces with too many decorative items</li>
          <li>Dark, oppressive color schemes</li>
        </ul>

        <h2>The 1970s Design Disasters</h2>
        <p>
          The 1970s brought some questionable design choices:
        </p>
        <ul>
          <li>Shag carpeting in bathrooms</li>
          <li>Avocado green appliances</li>
          <li>Wood paneling everywhere</li>
          <li>Overwhelming wallpaper patterns</li>
        </ul>

        <h2>Modern Design Mistakes</h2>
        <p>
          Even in modern times, we see common design errors:
        </p>
        <ul>
          <li>Ignoring functionality for aesthetics</li>
          <li>Poor space planning</li>
          <li>Inadequate lighting solutions</li>
          <li>Mismatched design elements</li>
        </ul>

        <h2>Conclusion</h2>
        <p>
          While these design mistakes might seem obvious now, they serve as important lessons for modern 
          interior designers. Understanding past failures helps create better, more thoughtful spaces today.
        </p>
      </div>

      {/* Author Bio */}
      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">About the Author</h2>
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
            alt={post.author}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h3 className="font-medium text-gray-900">{post.author}</h3>
            <p className="text-gray-600 mb-2">Interior Design Expert</p>
            <p className="text-sm text-gray-600">
              Sarah Chen is an interior design expert with over 10 years of experience. 
              She regularly writes about design trends, home improvement, and sustainable living.
            </p>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/blog/median-ui-template" className="group">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
                alt="Median UI Template"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <span>Mar 16</span>
              <span>•</span>
              <span>Product</span>
            </div>
            <h3 className="font-bold group-hover:text-blue-600 transition-colors">
              Median UI - Blogger Template (Sample Post Product)
            </h3>
          </Link>
          <Link to="/blog/weight-loss-success" className="group">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800"
                alt="Weight Loss Success"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <span>Mar 14</span>
              <span>•</span>
              <span>Fitness</span>
            </div>
            <h3 className="font-bold group-hover:text-blue-600 transition-colors">
              14 Things Your Boss Expects You Know About Weight Loss Success Stories
            </h3>
          </Link>
        </div>
      </div>

      {/* Ads Section */}
      <div className="mt-12 bg-pink-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">ads here</p>
      </div>
    </article>
  );
}