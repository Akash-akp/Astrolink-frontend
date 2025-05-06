import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toast';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import proxyService from '../../utils/proxyService';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('client');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockCredentials = {
    client: { username: 'client@example.com', password: 'Client@147' },
    astrologer: { username: 'astrologer@example.com', password: 'astro123' },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await proxyService.post('/auth/login', {
        email: username,
        password: password,
      });
  
      if (response.status === 200) {
        const responseData = response.data;
        const token = responseData.token;
        let userRole = JSON.parse(atob(token.split('.')[1])).roles[0];
        const userId = JSON.parse(atob(token.split('.')[1])).userId;
  
        if (userRole === 'ROLE_USER') {
          userRole = 'client';
        }else if (userRole === 'ROLE_ASTROLOGER') {
          userRole = 'astrologer';
        }
  
        if (userRole !== role) {
          console.log(userRole,role)
          toast.error('Invalid username or password!', { position: 'top' });
          setIsLoading(false);
          return;
        }
  
        toast.success('Login successful!', { position: 'top' });
        responseData.role = role;
        responseData.user.id = userId;
        login(responseData); // Store user in AuthContext and localStorage
  
        if (userRole === 'client') {
          navigate('/client/dashboard');
        } else {
          navigate('/astrologer/dashboard');
        }
      }
    } catch (error) {
      if(error.response && (error.response.status === 401||error.response.status === 40)) {
        toast.error('Invalid username or password!');
      }else if (error.response && error.response.status === 403) {
        toast.error('You do not have permission to access this resource.');
      } else if (error.response && error.response.status === 500) {
        toast.error('Server error. Please try again later.');
      } 
      // Handle errors from the proxyService
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Login to AstroLink
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username/Email
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username or email"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            I am a:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="client"
                checked={role === 'client'}
                onChange={() => setRole('client')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Client</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="astrologer"
                checked={role === 'astrologer'}
                onChange={() => setRole('astrologer')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Astrologer</span>
            </label>
          </div>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;