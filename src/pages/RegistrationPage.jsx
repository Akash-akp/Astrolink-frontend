import React,{ useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import RegistrationForm from '../components/auth/RegistrationForm';

const RegistrationPage = () => {
  const { role } = useParams();
  
  // Validate role parameter
  if (role !== 'client' && role !== 'astrologer') {
    return <Navigate to="/register/client" replace />;
  }
  
  
  console.log("roleParam",role);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            AstroLink
          </Link>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            Create your {role} account
          </h2>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Want to register as a{' '}
              <Link
                to={`/register/${role === 'client' ? 'astrologer' : 'client'}`}
                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                onClick={() => setRole(role === 'client' ? 'astrologer' : 'client')}
              >
                {role === 'client' ? 'astrologer' : 'client'}
              </Link>
              ?
            </p>
            <p className="mt-1">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Pass the role dynamically to RegistrationForm */}
        <RegistrationForm initialRole={role} />
      </div>
    </div>
  );
};

export default RegistrationPage;