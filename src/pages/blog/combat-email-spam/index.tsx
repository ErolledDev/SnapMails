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
            to="/blog/protect-online-identity"
            className="group block"
          >
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                  Top 10 Ways to Protect Your Online Identity
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Essential strategies for maintaining your privacy in the digital age.
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