import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import { useChat } from '../../contexts/ChatContext';
import { useRequest } from '../../contexts/RequestContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ClientChatView = () => {
  const { requestId } = useParams();
  const { activeRequests, activeChannels, isLoading: requestLoading } = useRequest();
  const { setCurrentChannel } = useChat();
  
  // Find the request by ID
  const request = activeRequests.find(r => r.id === requestId);
  
  // Find all channels associated with this request
  const requestChannels = activeChannels.filter(c => c.requestId === requestId);
  
  useEffect(() => {
    // Clear current channel when component unmounts
    return () => {
      setCurrentChannel(null);
    };
  }, [setCurrentChannel]);
  
  if (requestLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!request) {
    return <Navigate to="/client/dashboard" />;
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
        {request.title}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Your anonymous handle for this request: <span className="font-medium text-purple-600 dark:text-purple-400">{request.clientHandle}</span>
      </p>
      
      {requestChannels.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No astrologers have accepted your consultation request yet.
            When they do, you'll be able to chat with them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                Active Astrologers
              </h3>
              
              <div className="space-y-2">
                {requestChannels.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => setCurrentChannel(channel)}
                    className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <p className="font-medium text-gray-800 dark:text-white">
                      {channel.astrologerHandle}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Reputation score: 8/10
                    </p>
                  </button>
                ))}
              </div>
              
              {requestChannels.length < 3 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {3 - requestChannels.length} more astrologers can join this consultation.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2 h-[600px]">
            <ChatInterface channelId={requestChannels[0]?.id || ''} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientChatView;