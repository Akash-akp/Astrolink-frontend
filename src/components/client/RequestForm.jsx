import React, { useState } from 'react';
import { useRequest } from '../../contexts/RequestContext';
import LoadingSpinner from '../common/LoadingSpinner';
import proxyService from '../../utils/proxyService';

const RequestForm = ({ onRequestCreated }) => {
  const { createNewRequest, isLoading, activeRequests } = useRequest();
  
  const [title, setTitle] = useState('');
  const [showBirthDetails, setShowBirthDetails] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const birthDetails = showBirthDetails 
        ? { birthDate, birthTime, birthPlace } 
        : { birthDate: "unknown", birthTime: "unknown", birthPlace: "unknown" };
        
      const response = await proxyService.post(
        '/request/create/' + JSON.parse(localStorage.getItem('currentUser')).user.id,
        {
          title,
          ...birthDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log(data);

        // Notify the parent component to rerender the page
        if (onRequestCreated) {
          onRequestCreated();
        }
      }
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      // Reset the form fields
      setTitle('');
      setBirthDate('');
      setBirthTime('');
      setBirthPlace('');
      setShowBirthDetails(false);
      window.location.reload();
    }
  };

  // Check if client has reached the maximum number of active requests
  const hasReachedMaxRequests = activeRequests.length >= 3;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Create New Consultation Request
      </h3>
      
      {hasReachedMaxRequests ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200">
          <p className="text-sm">
            You have reached the maximum limit of 3 active requests. Please close an existing request before creating a new one.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Consultation Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Career Horoscope Analysis"
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showBirthDetails}
                onChange={() => setShowBirthDetails(!showBirthDetails)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Include birth details (optional)
              </span>
            </label>
          </div>
          
          {showBirthDetails && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Birth Time
                </label>
                <input
                  type="time"
                  id="birthTime"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Birth Place
                </label>
                <input
                  type="text"
                  id="birthPlace"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="e.g., Mumbai, India"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !title}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <LoadingSpinner size="small" /> : 'Create Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RequestForm;