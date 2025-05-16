import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  let dashboardUrl = '/';
  try {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.role) {
      dashboardUrl =
        user.role === 'client'
          ? '/client/dashboard'
          : user.role === 'astrologer'
          ? '/astrologer/dashboard'
          : '/';
    }
  } catch {
    dashboardUrl = '/';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Page Not Found</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to={dashboardUrl}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default PageNotFound;