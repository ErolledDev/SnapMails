import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4" role="main">
      <div className="text-center">
        <div className="flex justify-center mb-8" aria-hidden="true">
          <Mail className="w-16 h-16 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          aria-label="Return to home page"
        >
          <Home className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}