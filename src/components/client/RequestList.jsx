import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, X, MessageCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import proxyService from '../../utils/proxyService';
import { toast } from 'react-toast';

const RequestList = ({ activeRequests, setActiveRequests, isLoading , setRequestHistory ,setReloadRequest }) => {
  const navigate = useNavigate();

  const handleViewChat = (requestId) => {
    navigate(`/chat/consultation/${requestId}`);
  };

  const handleCloseRequest = async (requestId) => {
    try {
      const currentRequest = activeRequests.find((request) => request.id === requestId);
      const response = await proxyService.delete(
        `/request/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`,
          },
        }
      );
      console.log('Request closed successfully');
      setRequestHistory((prevHistory) => [
        ...prevHistory,
        currentRequest
      ]);
      setActiveRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
      setReloadRequest((prev) => !prev);
      toast.success('Request closed successfully!');
    } catch (error) {
      console.error('Error closing request:', error);
      toast.error('Failed to close the request. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner className="py-10" />;
  }

  return (
    <div className="space-y-8">
      {/* Active Requests Section */}
      <div>
        {activeRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any active consultation requests.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {request.title}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewChat(request.id)}
                        className="p-1.5 rounded-full text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        title="View chats"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleCloseRequest(request.id)}
                        className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Close request"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        Astrologers: {request.acceptingAstrologersCount}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 font-medium">
                      <span>Your anonymous handle: {request.clientHandle}</span>
                    </div>
                  </div>

                  {request.birthDate && request.birthTime && request.birthPlace && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Birth Details:
                      </p>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <p>Date: {request.birthDate}</p>
                        <p>Time: {request.birthTime}</p>
                        <p>Place: {request.birthPlace}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-5 py-3 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-100 dark:border-purple-800/30">
                  <button
                    onClick={() => handleViewChat(request.id)}
                    className="w-full py-2 text-center text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                  >
                    View Consultation Chats
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;